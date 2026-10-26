'use client';
import { useState, useEffect } from 'react';

export default function SiniestrosPage() {
  const [siniestros, setSiniestros] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [form, setForm] = useState({
    id_poliza: '',
    id_cobertura: '3', // Por defecto Gastos Médicos (ID 3)
    fecha_siniestro: '',
    descripcion: '',
    monto_reclamado: ''
  });

  useEffect(() => {
    fetch('/api/siniestros').then(res => res.json()).then(data => setSiniestros(data));
    fetch('/api/polizas').then(res => res.json()).then(data => setPolizas(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/siniestros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('¡Siniestro registrado con éxito!');
      window.location.reload();
    } else {
      alert('Error al registrar el siniestro');
    }
  };

  const cambiarEstado = async (id_siniestro, nuevoEstado) => {
    const res = await fetch('/api/siniestros', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_siniestro, estado: nuevoEstado })
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert('Error al actualizar el estado');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Gestión de Siniestros</h1>

      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3>Registrar Nuevo Siniestro</h3>
        
        <label>Seleccionar Póliza:</label>
        <select value={form.id_poliza} onChange={e => setForm({...form, id_poliza: e.target.value})} required style={{ padding: '8px' }}>
          <option value="">Seleccione una póliza...</option>
          {polizas.map(p => (
            <option key={p.id_poliza} value={p.id_poliza}>
              Póliza: {p.numero_poliza} ({p.apellido}, {p.nombre})
            </option>
          ))}
        </select>

        <label>Tipo de Cobertura:</label>
        <select value={form.id_cobertura} onChange={e => setForm({...form, id_cobertura: e.target.value})} style={{ padding: '8px' }}>
          <option value="1">1 - Muerte Accidental</option>
          <option value="2">2 - Invalidez Total</option>
          <option value="3">3 - Gastos Médicos</option>
          <option value="4">4 - Incapacidad Temporal</option>
          <option value="5">5 - Asistencia en Viaje</option>
        </select>

        <label>Fecha del Siniestro:</label>
        <input type="date" value={form.fecha_siniestro} onChange={e => setForm({...form, fecha_siniestro: e.target.value})} required />

        <input placeholder="Descripción del siniestro" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
        
        <input placeholder="Monto Reclamado" type="number" step="0.01" value={form.monto_reclamado} onChange={e => setForm({...form, monto_reclamado: e.target.value})} required />

        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          REGISTRAR SINIESTRO
        </button>
      </form>

      <h2>Listado de Siniestros</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#eaeaea' }}>
            <th>ID</th>
            <th>Nº Póliza</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto Reclamado</th>
            <th>Estado Actual</th>
            <th>Acción / Cambiar Estado</th>
          </tr>
        </thead>
        <tbody>
          {siniestros.map(s => (
            <tr key={s.id_siniestro}>
              <td>{s.id_siniestro}</td>
              <td>{s.numero_poliza}</td>
              <td>{s.fecha_siniestro}</td>
              <td>{s.descripcion}</td>
              <td>${s.monto_reclamado}</td>
              <td><b>{s.estado}</b></td>
              <td>
                <select value={s.estado} onChange={e => cambiarEstado(s.id_siniestro, e.target.value)} style={{ padding: '4px' }}>
                  <option value="REPORTADO">REPORTADO</option>
                  <option value="EN_REVISION">EN_REVISION</option>
                  <option value="APROBADO">APROBADO</option>
                  <option value="RECHAZADO">RECHAZADO</option>
                  <option value="PAGADO">PAGADO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}