import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdminFetch } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const ops = await supabaseAdminFetch("/rest/v1/operations?select=*&order=first_discovered_at.desc");
    const lots = await supabaseAdminFetch("/rest/v1/operation_lots_items?select=*&order=row_order.asc");
    return NextResponse.json({ status: "success", operations: ops || [], lots: lots || [] });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fp = crypto
      .createHash("sha256")
      .update(`${body.government_entity}|${body.reference_number}|${body.operation_type}`)
      .digest("hex");
    const contentHash = crypto
      .createHash("sha256")
      .update(JSON.stringify({
        title: body.title,
        deadline: body.submission_deadline,
        guarantee: body.primary_guarantee_amount,
        has_booklet: body.has_terms_booklet
      }))
      .digest("hex");

    // Check existing operation by portal_operation_id or canonical_fingerprint (T-01 & T-02)
    const existing = await supabaseAdminFetch(
      `/rest/v1/operations?or=(portal_operation_id.eq.${encodeURIComponent(body.portal_operation_id)},canonical_fingerprint.eq.${fp})&select=*`
    );

    if (!existing || existing.length === 0) {
      const created = await supabaseAdminFetch("/rest/v1/operations", {
        method: "POST",
        body: JSON.stringify({
          portal_operation_id: body.portal_operation_id,
          canonical_fingerprint: fp,
          reference_number: body.reference_number,
          title: body.title,
          operation_type: body.operation_type || "OTHER",
          government_entity: body.government_entity,
          execution_location: body.execution_location,
          has_terms_booklet: Boolean(body.has_terms_booklet),
          current_version_no: 1,
          primary_guarantee_amount: body.primary_guarantee_amount || null,
          ingestion_status: body.has_terms_booklet ? "DISCOVERED" : "BOOKLET_MISSING",
          analysis_status: "PENDING",
          distribution_status: "PENDING",
          latest_content_hash: contentHash
        })
      });
      return NextResponse.json({ action: "CREATED_NEW", operation: created[0] });
    }

    const op = existing[0];
    if (op.latest_content_hash === contentHash) {
      return NextResponse.json({ action: "DUPLICATE_IGNORED", operation: op });
    }

    const newVer = (op.current_version_no || 1) + 1;
    const updated = await supabaseAdminFetch(`/rest/v1/operations?id=eq.${op.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: body.title,
        current_version_no: newVer,
        latest_content_hash: contentHash,
        last_updated_at: new Date().toISOString()
      })
    });
    return NextResponse.json({ action: "UPDATED_EXISTING", version_no: newVer, operation: updated[0] });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
