-- SQL para creación inicial de guards y packages
drop table if exists packages cascade;
drop table if exists guards cascade;

-- Tabla de guardas
create table guards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre varchar(80) not null,
  activo boolean default true,
  email varchar(120),
  telefono varchar(20),
  created_at timestamptz default now(),
  deleted_at timestamptz
);

-- Tabla de paquetes
create table packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torre varchar(20) not null,
  apartamento varchar(20) not null,
  estado varchar(20) default 'registrado',
  guard_id uuid references guards(id) on delete set null,
  fecha_registro timestamptz default now(),
  fecha_entrega timestamptz,
  receptor varchar(80),
  foto_url text,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

create index idx_packages_apartamento on packages(apartamento);
create index idx_packages_estado on packages(estado);
create index idx_packages_guard on packages(guard_id);
create index idx_packages_deleted on packages(deleted_at);

-- Soft delete implementado con deleted_at
-- Probar integridad con inserción simple
delete from packages;
delete from guards;

insert into guards (nombre, email, telefono) values ('Juan Perez', 'juan@ejemplo.com', '3001234567');
insert into packages (torre, apartamento, guard_id, receptor, foto_url) select 'A', '101', id, 'Carlos Díaz', 'https://storage.supabase.com/paquetes-fotos/paquete1.jpg' from guards limit 1;

-- Validar la relación
select p.*, g.nombre as nombre_guarda from packages p left join guards g on p.guard_id = g.id;
