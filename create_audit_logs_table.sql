-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    doctor_id uuid REFERENCES public.doctors(id),
    lab_id uuid REFERENCES public.labs(lab_id),
    all_lab_inputs jsonb,
    risk_classification_id uuid REFERENCES public.risk_classification(id),
    risk_class text,
    action_type text DEFAULT 'CREATE' -- CREATE, UPDATE, DELETE
);

-- Enable Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_audit_logs_doctor_id ON public.audit_logs(doctor_id);
CREATE INDEX idx_audit_logs_lab_id ON public.audit_logs(lab_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create a function to automatically populate audit_logs when labs are inserted
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        doctor_id,
        lab_id,
        all_lab_inputs,
        risk_classification_id,
        risk_class,
        action_type
    ) VALUES (
        NEW.created_by,
        NEW.lab_id,
        row_to_json(NEW),
        NULL, -- Will be updated when risk classification is determined
        'Pending Classification',
        TG_OP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create audit log when lab is inserted
CREATE TRIGGER trigger_create_audit_log
    AFTER INSERT ON public.labs
    FOR EACH ROW
    EXECUTE FUNCTION public.create_audit_log();
