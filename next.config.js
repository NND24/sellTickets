// next.config.js
module.exports = {
  // Đặt target là 'serverless' nếu bạn muốn sử dụng serverless functions trên Vercel
  target: "serverless",

  // Cấu hình cho WebSocket nếu cần
  webpack(config) {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // Để giải quyết lỗi trong việc import module
      },
    });

    return config;
  },

  // Cấu hình khác nếu cần thiết
  env: {
    MY_SECRET_KEY: "your_secret_key", // Ví dụ để lưu trữ biến môi trường
  },

  // Bạn cũng có thể cấu hình thêm các mục khác như rewrites, redirects, và headers nếu cần
};
