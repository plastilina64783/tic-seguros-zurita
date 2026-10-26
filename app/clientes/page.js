'use client';
import { useState, useEffect } from 'react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: ''
  });

  // Cargar clientes al iniciar la página
  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  // Manejar el envío del formulario (INSERT real)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      const nuevoCliente = await res.json();
      setClientes([...clientes, nuevoCliente]);
      setForm({ nombre: '', apellido: '', documento: '', email: '', telefono: '', fecha_nacimiento: '', direccion: '' });
      alert('¡Cliente guardado con éxito!');
    } else {
      alert('Error al guardar el cliente');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestión de Clientes</h1>
      
      {/* Formulario mínimo obligatorio */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3>Registrar Nuevo Cliente</h3>
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
        <input placeholder="Apellido" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} required />
        <input placeholder="DNI / Documento" value={form.documento} onChange={e => setForm({...form, documento: e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
        <input type="date" placeholder="Fecha de Nacimiento" value={form.fecha_nacimiento} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} required />
        <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          GUARDAR
        </button>
      </form>

      <h2>Listado de Clientes Registrados</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#eaeaea' }}>
            <th>ID</th>
            <th>Apellido y Nombre</th>
            <th>Documento</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.apellido}, {c.nombre}</td>
              <td>{c.documento}</td>
              <td>{c.email || '-'}</td>
              <td>{c.telefono || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}