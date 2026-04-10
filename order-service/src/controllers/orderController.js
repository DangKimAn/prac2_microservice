const Order = require("../models/Order");
// Tạo đơn hàng mới

const createOrder = async (req, res, next) => {
    try {
        const { customerId, customerName, customerEmail, items, shippingAddress, note } =
            req.body;
      
        const processedItems = items.map(item => ({
            ...item,
            subtotal: item.price * item.quantity,
        }));
        const totalAmount = processedItems.reduce((sum, i) => sum + i.subtotal, 0);
        const order = await Order.create({
            customerId, customerName, customerEmail,
            items: processedItems, totalAmount,
            shippingAddress, note
        });
        res.status(201).json({ success: true, data: order });
    } catch (error) { next(error); }
};

// Lấy đơn hàng của customer, có phân trang
const getOrdersByCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const { page = 1, limit = 10, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = { customerId: parseInt(customerId) };
        if (status) filter.status = status;
        const [orders, total] = await Promise.all([
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Order.countDocuments(filter)
        ]);
        res.json({
            success: true, data: orders,
            pagination: {
                total, page: parseInt(page), totalPages: Math.ceil(total /
                    limit)
            }
        });
    } catch (error) { next(error); }
};
// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        res.json({ success: true, data: order });
    } catch (error) { next(error); }
};


// const createOrder = async (req, res, next) => {
//     try {
//         // 1. Lấy ID người dùng ĐÃ XÁC THỰC từ Header (do Gateway truyền sang)
//         const authenticatedCustomerId = req.headers['x-user-id'];

//         if (!authenticatedCustomerId) {
//             return res.status(401).json({ message: "Không tìm thấy thông tin xác thực" });
//         }

//         const { customerName, customerEmail, items, shippingAddress, note } = req.body;

//         // 3. Tính toán subtotal (Lưu ý: Trong thực tế nên lấy giá từ DB thay vì tin req.body)
//         const processedItems = items.map(item => ({
//             ...item,
//             subtotal: item.price * item.quantity,
//         }));
//         const totalAmount = processedItems.reduce((sum, i) => sum + i.subtotal, 0);

//         // 4. Tạo đơn hàng với ID lấy từ Header
//         const order = await Order.create({
//             customerId: authenticatedCustomerId, // Dùng ID an toàn này
//             customerName, 
//             customerEmail,
//             items: processedItems, 
//             totalAmount,
//             shippingAddress, 
//             note
//         });

//         res.status(201).json({ success: true, data: order });
//     } catch (error) { 
//         next(error); 
//     }
// };

// const getOrdersByCustomer = async (req, res, next) => {
//     try {
//         // 1. Lấy ID người dùng từ Header (do Gateway truyền sang)
//         const authenticatedUserId = req.headers['x-user-id'];
//         const userRole = req.headers['x-user-role'];
        
//         // 2. Lấy ID từ URL params
//         const { customerId } = req.params;

//         // 3. KIỂM TRA QUYỀN TRUY CẬP (Rất quan trọng)
//         // Nếu không phải Admin VÀ ID trong Token khác ID trong URL -> Chặn luôn
//         if (userRole !== 'admin' && authenticatedUserId !== customerId) {
//             return res.status(403).json({ 
//                 success: false, 
//                 message: "Bạn không có quyền xem đơn hàng của người khác" 
//             });
//         }

//         // 4. Thiết lập filter và phân trang
//         const { page = 1, limit = 10, status } = req.query;
//         const skip = (parseInt(page) - 1) * parseInt(limit);
        
//         // Lưu ý: Nếu customerId trong DB là String thì không cần parseInt
//         const filter = { customerId: customerId }; 
//         if (status) filter.status = status;

//         // 5. Query Database
//         const [orders, total] = await Promise.all([
//             Order.find(filter)
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(parseInt(limit)),
//             Order.countDocuments(filter)
//         ]);

//         res.json({
//             success: true, 
//             data: orders,
//             pagination: {
//                 total, 
//                 page: parseInt(page), 
//                 totalPages: Math.ceil(total / parseInt(limit))
//             }
//         });
//     } catch (error) { 
//         next(error); 
//     }
// };


// const updateOrderStatus = async (req, res, next) => {
//     try {
//         const { status } = req.body;
//         const orderId = req.params.id;
        
//         // Lấy thông tin User từ Header (do Gateway truyền sang)
//         const userIdFromHeader = req.headers['x-user-id'];
//         const userRoleFromHeader = req.headers['x-user-role']; 
//         // 1. Tìm đơn hàng trước để kiểm tra quyền sở hữu
//         const order = await Order.findById(orderId);

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
//         }

//         // 2. KIỂM TRA QUYỀN (Rất quan trọng)
//         // Nếu không phải Admin VÀ không phải chủ nhân đơn hàng -> Từ chối
//         if (userRoleFromHeader !== 'admin' && order.customerId.toString() !== userIdFromHeader) {
//             return res.status(403).json({ success: false, message: "Bạn không có quyền cập nhật đơn hàng này" });
//         }

//         // 3. KIỂM TRA LOGIC TRẠNG THÁI (Tùy chọn)
//         // Ví dụ: Khách hàng chỉ được phép đổi sang trạng thái 'cancelled'
//         if (userRoleFromHeader !== 'admin' && status !== 'cancelled') {
//             return res.status(400).json({ success: false, message: "Bạn chỉ có quyền hủy đơn hàng" });
//         }

//         // 4. Cập nhật
//         order.status = status;
//         await order.save({ runValidators: true });

//         res.json({ success: true, data: order });
//     } catch (error) { 
//         next(error); 
//     }
// };
module.exports = { createOrder, getOrdersByCustomer, updateOrderStatus };