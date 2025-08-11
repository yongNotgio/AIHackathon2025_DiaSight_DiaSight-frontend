import { supabase } from '../supabaseClient';

export const fetchAuditLogs = async () => {
  try {
    // Query all contents from the audit_logs table
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
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
      allLabInputs: log.all_lab_inputs,
      riskClassification: log.risk_class || log.risk_classification || 'Pending Classification',
      actionType: log.action_type || 'CREATE'
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { data: [], error: error.message };
  }
};
