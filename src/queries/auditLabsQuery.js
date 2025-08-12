import { supabase } from '../supabaseClient';

export const fetchAuditLogs = async () => {
  try {
    // Query audit logs with lab data joined
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        labs:lab_id (
          lab_id,
          age,
          sex,
          sbp,
          dbp,
          hbp,
          duration,
          hba1c,
          ldl,
          hdl,
          cholesterol,
          urea,
          bun,
          uric,
          egfr,
          triglycerides,
          ucr,
          alt,
          ast,
          created_by
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data for display
    const transformedData = data.map(log => ({
      auditId: log.id || log.audit_id,
      dateCreated: new Date(log.created_at).toLocaleDateString(),
      doctorId: log.doctor_id,
      doctorName: `Doctor ${log.doctor_id}`, // Simple display since no join
      labId: log.lab_id,
      // Include all lab data
      labData: log.labs || {},
      // Include all lab inputs from the jsonb field as backup
      allLabInputs: log.all_lab_inputs,
      riskClassification: log.risk_class || log.risk_classification || 'Pending Classification'
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { data: [], error: error.message };
  }
};
