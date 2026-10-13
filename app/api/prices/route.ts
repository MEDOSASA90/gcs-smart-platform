import { NextRequest, NextResponse } from "next/server";
import { supabaseAdminFetch } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id") || req.nextUrl.searchParams.get("user_id") || "";
  if (!userId) {
    return NextResponse.json({ status: "error", message: "معرف المستخدم مطلوب لعزل سجل الأسعار" }, { status: 401 });
  }
  try {
    const rows = await supabaseAdminFetch(
      `/rest/v1/user_price_records?owner_user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc`
    );
    return NextResponse.json({ status: "success", prices: rows || [] });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
