import React from 'react';
import { CreateEmployeeForm } from '../components/CreateEmployeeForm';
import { IngresosEgresosList } from '../components/IngresosEgresosList';

export const AdminView = () => {
  return (
    <section className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 md:mt-24">
      {/* Left side: Create Employee Form */}
      <div className="w-full">
        <CreateEmployeeForm />
      </div>

      {/* Right side: List of entries */}
      <div className="w-full">
        <IngresosEgresosList />
      </div>
    </section>
  );
};
