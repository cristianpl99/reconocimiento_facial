import React, { useState } from 'react';
import { CreateEmployeeForm } from '../components/CreateEmployeeForm';
import { IngresosEgresosList } from '../components/IngresosEgresosList';
import { EmployeeList } from '../components/EmployeeList';

export const AdminView = () => {
  const [showIngresosEgresos, setShowIngresosEgresos] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  return (
    <section className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 md:mt-24">
      <div className="w-full">
        <CreateEmployeeForm />
      </div>
      <div className="w-full">
        <div className="flex flex-row flex-wrap gap-4 justify-center mb-8">
          <button onClick={() => { setShowIngresosEgresos(true); setShowEmployeeList(false); }} className="h-12 px-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 whitespace-nowrap">Ingresos - Egresos</button>
          <button onClick={() => { setShowEmployeeList(true); setShowIngresosEgresos(false); }} className="h-12 px-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 whitespace-nowrap">Listado de Empleados</button>
        </div>
        {showIngresosEgresos && <IngresosEgresosList />}
        {showEmployeeList && <EmployeeList />}
      </div>
    </section>
  );
};
