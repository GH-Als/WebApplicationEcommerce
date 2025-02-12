package com.masa.masa.Controller;

import com.masa.masa.Entity.CustomerOrder;
import com.masa.masa.Entity.OrderItem;
import com.masa.masa.Entity.Product;
import com.masa.masa.Repository.OrderRepository;
import com.masa.masa.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<CustomerOrder> createOrder(@RequestBody CustomerOrder order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        for (OrderItem item : order.getItems()) {
            // Find the product by name
            Product product = productRepository.findByName(item.getName());
            if (product == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null); // Return error if the product does not exist
            }

            // Check if sufficient stock is available
            if (product.getStockQuantity() < item.getQuantity()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null); // Return error if not enough stock
            }

            // Deduct the stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product); // Save the updated product stock

            // Set the parent order for each item
            item.setCustomerOrder(order);
        }

        CustomerOrder savedOrder = orderRepository.save(order); // Save the order along with its items
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }


}

