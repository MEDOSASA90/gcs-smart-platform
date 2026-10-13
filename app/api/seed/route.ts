import { NextResponse } from "next/server";
import { supabaseAdminFetch } from "@/lib/supabaseServer";

export async function POST() {
  try {
    // 1. Seed Operations
    const opsPayload = [
      {
        portal_operation_id: "GCS-2026-88412",
        canonical_fingerprint: "fp_gcs_2026_88412_river_transport_scrap",
        reference_number: "MZ-2026-88412",
        title: "مزايدة علنية لبيع لوطات خردة معادن وكهنة بطاريات وإطارات",
        operation_type: "AUCTION",
        government_entity: "الهيئة العامة للنقل النهري",
        execution_location: "القاهرة - أثر النبي",
        inspection_location: "مخازن الهيئة بأثر النبي",
        has_terms_booklet: true,
        current_version_no: 1,
        primary_guarantee_amount: 50000,
        booklet_price: 500,
        ingestion_status: "BOOKLET_DOWNLOADED",
        analysis_status: "COMPLETED_PARTIAL",
        distribution_status: "DISTRIBUTED_PARTIAL",
        latest_content_hash: "hash_v1_88412"
      },
      {
        portal_operation_id: "GCS-2026-88419",
        canonical_fingerprint: "fp_gcs_2026_88419_alex_port_scrap_yard",
        reference_number: "MZ-2026-88419",
        title: "مزايدة بيع خردة حديد وتأجير ساحة تخزين جمركية",
        operation_type: "AUCTION",
        government_entity: "هيئة ميناء الإسكندرية",
        execution_location: "الإسكندرية - الميناء الجمركي",
        has_terms_booklet: true,
        current_version_no: 1,
        primary_guarantee_amount: 100000,
        booklet_price: 1000,
        ingestion_status: "BOOKLET_DOWNLOADED",
        analysis_status: "COMPLETED_FULL",
        distribution_status: "DISTRIBUTED_FULL",
        latest_content_hash: "hash_v1_88419"
      },
      {
        portal_operation_id: "GCS-2026-88425",
        canonical_fingerprint: "fp_gcs_2026_88425_mot_it_supplies",
        reference_number: "TN-2026-88425",
        title: "مناقصة عامة لتوريد أجهزة حاسب آلي ومستلزمات شبكات",
        operation_type: "TENDER",
        government_entity: "وزارة النقل - العاصمة الإدارية",
        execution_location: "العاصمة الإدارية الجديدة",
        has_terms_booklet: false,
        current_version_no: 1,
        primary_guarantee_amount: 75000,
        booklet_price: 0,
        ingestion_status: "BOOKLET_MISSING",
        analysis_status: "PENDING",
        distribution_status: "DISTRIBUTED_PARTIAL",
        latest_content_hash: "hash_v1_88425"
      }
    ];

    const ops = await supabaseAdminFetch("/rest/v1/operations?on_conflict=portal_operation_id", {
      method: "POST",
      headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(opsPayload)
    });

    return NextResponse.json({
      status: "success",
      message: `تم حفظ ومزامنة ${ops.length} عمليات في جدول operations على Supabase بنجاح!`,
      operations: ops
    });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
