
import "dotenv/config";
import { supabase } from "../server/supabase";

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .limit(1);

  if (error) {
    console.error("❌ Kết nối/truy vấn Supabase thất bại:");
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  console.log("✅ Kết nối Supabase thành công!");
  console.log("Bảng products có thể truy vấn.");
  console.log("Số dòng nhận được:", data.length);
}

main().catch((error) => {
  console.error("❌ Lỗi kiểm tra:", error.message);
  process.exitCode = 1;
});
