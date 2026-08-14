import ListaUsuarios from "../components/usuarios/ListaUsuarios";

function ListaUsuariosPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Usuarios registrados</h2>
      </div>
      <ListaUsuarios />
    </div>
  );
}

export default ListaUsuariosPage;