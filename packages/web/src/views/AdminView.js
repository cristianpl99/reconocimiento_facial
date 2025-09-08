import React from 'react';
import { CreateEmployeeForm } from '../components/CreateEmployeeForm';
import { IngresosEgresosList } from '../components/IngresosEgresosList';

export const AdminView = () => {
  return (
    <section className="w-full mx-auto flex flex-col md:flex-row items-stretch justify-center gap-8 mt-16 md:mt-24">
      {/* Left side: Create Employee Form */}
      <div className="w-full md:w-1/2">
        <CreateEmployeeForm />
      </div>

      {/* Right side: List of entries */}
      <div className="w-full md:w-1/2">
        <IngresosEgresosList />
      </div>
    </section>
  );
};
