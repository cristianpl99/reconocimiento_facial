import React from 'react';
import { CreateEmployeeForm } from '../components/CreateEmployeeForm';
import { IngresosEgresosList } from '../components/IngresosEgresosList';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const AdminView = () => {
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#ingresos-table' });
    doc.save('ingresos-egresos.pdf');
  };

  return (
    <section className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 md:mt-24">
      <div className="w-full">
        <CreateEmployeeForm />
      </div>
      <div className="w-full">
        <IngresosEgresosList />
        <button
          onClick={handleDownloadPdf}
          className="mt-4 h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Descargar en .pdf
        </button>
      </div>
    </section>
  );
};
