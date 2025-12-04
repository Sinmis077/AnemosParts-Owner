import { PartForm } from "@/components/PartForm";

export function CreatePartPage() {
  return (
    <main className="flex w-full justify-center p-10">
      <div className="w-full md:w-[75%]">
        <PartForm />
      </div>
    </main>
  );
}