// next.config.js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // Giải quyết lỗi trong việc import module
      },
    });

    return config;
  },

  env: {
    MY_SECRET_KEY: "your_secret_key", // Ví dụ để lưu trữ biến môi trường
  },

  // Bạn có thể thêm các cài đặt khác nếu cần như rewrites, redirects, headers, v.v.
};
