// src/swagger/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        OrderItem: {
          type: "object",
          required: ["productId", "productName", "price", "quantity", "subtotal"],
          properties: {
            productId: {
              type: "integer",
              example: 101
            },
            productName: {
              type: "string",
              example: "iPhone 15 Pro Max"
            },
            price: {
              type: "number",
              example: 32000000
            },
            quantity: {
              type: "integer",
              example: 2
            },
            subtotal: {
              type: "number",
              example: 64000000
            }
          }
        },

        ShippingAddress: {
          type: "object",
          properties: {
            street: {
              type: "string",
              example: "123 Nguyễn Huệ"
            },
            city: {
              type: "string",
              example: "Hồ Chí Minh"
            },
            district: {
              type: "string",
              example: "Quận 1"
            }
          }
        },

        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66152d2c1a23456789abcdef"
            },
            orderCode: {
              type: "string",
              example: "ORD-20260409-0001"
            },
            customerId: {
              type: "integer",
              example: 1
            },
            customerName: {
              type: "string",
              example: "Kim An"
            },
            customerEmail: {
              type: "string",
              example: "kiman@gmail.com"
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem"
              }
            },
            totalAmount: {
              type: "number",
              example: 64000000
            },
            totalItems: {
              type: "integer",
              example: 2
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "shipping",
                "delivered",
                "cancelled"
              ],
              example: "pending"
            },
            shippingAddress: {
              $ref: "#/components/schemas/ShippingAddress"
            },
            note: {
              type: "string",
              example: "Giao giờ hành chính"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        }
      }
    }
  }
};
module.exports = swaggerJsdoc(options);