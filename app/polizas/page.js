'use client';
import { useState, useEffect } from 'react';

export default function PolizasPage() {
  const [polizas, setPolizas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    numero_poliza: '',
    id_cliente: '',
    fecha_inicio: '',
    fecha_fin: '',
    prima: '',
    estado: 'ACTIVA'
  });

  // Cargar pólizas y clientes al iniciar
  useEffect(() => {
    fetch('/api/polizas')
      .then(res => res.json())
      .then(data => setPolizas(data));

    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/polizas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('¡Póliza creada con éxito!');
      window.location.reload();
    } else {
      alert('Error al registrar la póliza');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestión de Pólizas</h1>

      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3>Registrar Nueva Póliza</h3>
        <input placeholder="Número de Póliza (ej: POL-2024-011)" value={form.numero_poliza} onChange={e => setForm({...form, numero_poliza: e.target.value})} required />
        
        {/* Selección de cliente desde la base de datos */}
        <select value={form.id_cliente} onChange={e => setForm({...form, id_cliente: e.target.value})} required style={{ padding: '8px' }}>
          <option value="">Seleccione un cliente...</option>
          {clientes.map(c => (
            <option key={c.id_cliente} value={c.id_cliente}>
              {c.apellido}, {c.nombre} (DNI: {c.documento})
            </option>
          ))}
        </select>

        <label>Fecha de Inicio:</label>
        <input type="date" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} required />
        
        <label>Fecha de Vencimiento:</label>
        <input type="date" value={form.fecha_fin} onChange={e => setForm({...form, fecha_fin: e.target.value})} required />
        
        <input placeholder="Prima Anual" type="number" step="0.01" value={form.prima} onChange={e => setForm({...form, prima: e.target.value})} required />
        
        <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={{ padding: '8px' }}>
          <option value="ACTIVA">ACTIVA</option>
          <option value="VENCIDA">VENCIDA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          GUARDAR PÓLIZA
        </button>
      </form>

      <h2>Listado de Pólizas</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#eaeaea' }}>
            <th>Nº Póliza</th>
            <th>Cliente</th>
            <th>Inicio</th>
            <th>Vencimiento</th>
            <th>Prima</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {polizas.map(p => (
            <tr key={p.id_poliza}>
              <td>{p.numero_poliza}</td>
              <td>{p.apellido}, {p.nombre}</td>
              <td>{p.fecha_inicio}</td>
              <td>{p.fecha_fin}</td>
              <td>${p.prima}</td>
              <td>{p.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}