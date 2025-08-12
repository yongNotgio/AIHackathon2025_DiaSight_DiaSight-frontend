import { supabase } from '../supabaseClient';

export const fetchAuditLogs = async () => {
  try {
    // Query audit logs with lab data and doctor data joined
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        doctors:doctor_id (
          id,
          first_name,
          last_name
        ),
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
      dateCreated: new Date(log.created_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      doctorId: log.doctor_id,
      doctorName: log.doctors 
        ? `${log.doctors.first_name} ${log.doctors.last_name}`.trim()
        : `Doctor ${log.doctor_id}`, // Fallback if doctor data not found
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
