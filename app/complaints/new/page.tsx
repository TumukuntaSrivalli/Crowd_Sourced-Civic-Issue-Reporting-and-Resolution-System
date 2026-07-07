import ComplaintForm from "@/components/complaint/ComplaintForm";

export default function NewComplaintPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Submit New Complaint
      </h1>

      <ComplaintForm />
    </div>
  );
}