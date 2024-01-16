let usuarios = [];
const resultadosPorSolicitud = 500;
const solicitudesNecesarias = 10;

// Paginado
const primeraPaginaBtn = document.getElementById("primeraPagina");
const paginaAnteriorBtn = document.getElementById("paginaAnterior");
const proximaPaginaBtn = document.getElementById("proximaPagina");
const ultimaPaginaBtn = document.getElementById("ultimaPagina");

// Obtención de datos de la API
for (let i = 0; i < solicitudesNecesarias; i++) {
  setTimeout(() => {
    fetch(`https://randomuser.me/api/?results=${resultadosPorSolicitud}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          usuarios = usuarios.concat(data.results);
          if (
            usuarios.length ===
            resultadosPorSolicitud * solicitudesNecesarias
          ) {
            mostrarUsuarios(usuarios);
          }
        } else {
          console.error(
            "La respuesta de la API no contiene resultados válidos."
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API:", error);
      });
  }, i * 1000);
}

// Añade un evento de escucha al buscador
const buscadorUsuarios = document.getElementById("buscadorUsuarios");
buscadorUsuarios.addEventListener("input", (e) => {
  const palabraBuscada = e.target.value.toLowerCase();

  // Filtra los usuarios y muestra los resultados
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const nombre = `${usuario.name.first} ${usuario.name.last}`.toLowerCase();
    return nombre.includes(palabraBuscada);
  });

  mostrarUsuarios(usuariosFiltrados);
});

const cantidadPorPagina = 20;
let paginaActual = 1;

const mostrarUsuarios = (usuarios) => {
  const listaUsuarios = document.getElementById("listaUsuarios");
  listaUsuarios.innerHTML = "";

  const inicioIndice = (paginaActual - 1) * cantidadPorPagina;
  const finIndice = inicioIndice + cantidadPorPagina;

  const usuariosAMostrar = usuarios.slice(inicioIndice, finIndice);

  usuariosAMostrar.forEach((usuario) => {
    const elementoUsuario = document.createElement("div");
    elementoUsuario.classList.add("tarjetaUsuario");

    const contenedorAvatar = document.createElement("div");
    contenedorAvatar.classList.add("contenedorAvatar");

    contenedorAvatar.innerHTML = `
      <img src="${usuario.picture.thumbnail}" alt="Imágen del Usuario">
    `;

    elementoUsuario.appendChild(contenedorAvatar);

    // Crea un contenedor para la información del usuario
    const contenedorInfo = document.createElement("div");
    contenedorInfo.classList.add("contenedorInfo");

    // Formatea la fecha de nacimiento
    const fechaNacimiento = new Date(usuario.dob.date);
    const formatoFecha = ` ${fechaNacimiento.getDate()} - ${
      fechaNacimiento.getMonth() + 1
    } - ${fechaNacimiento.getFullYear()}`;

    // Agrega la información del usuario al nuevo contenedor
    contenedorInfo.innerHTML = `
      <h2>${usuario.name.first} ${usuario.name.last}</h2>
      <p><strong>Género:</strong> ${
        usuario.gender === "female"
          ? "Mujer"
          : "" || usuario.gender === "male"
          ? "Hombre"
          : ""
      }</p>
      <p><strong>Fecha de Nacimiento:</strong> ${formatoFecha}</p>
      <p><strong>Dirección:</strong> ${usuario.location.street.name} ${
      usuario.location.street.number
    }, ${usuario.location.city}, ${usuario.location.state}</p>
    <p><strong>Email:</strong> ${usuario.email}</p>
    `;

    // Agrega el contenedor de información al usuario
    elementoUsuario.appendChild(contenedorInfo);

    // Agrega el usuario a la lista
    listaUsuarios.appendChild(elementoUsuario);

    // Abre el modal
    elementoUsuario.addEventListener("click", () => {
      abrirModal(usuario, fechaNacimiento);
    });
  });

  document.getElementById("paginaActual").textContent = paginaActual;
  document.getElementById("paginas").textContent = Math.ceil(
    usuarios.length / cantidadPorPagina
  );

  actualizarBotonesPaginacion();
};

// Agrega un evento de escucha a los botones de paginación
primeraPaginaBtn.addEventListener("click", () => {
  paginaActual = 1;
  mostrarUsuarios(usuarios);
});

paginaAnteriorBtn.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarUsuarios(usuarios);
  }
});

proximaPaginaBtn.addEventListener("click", () => {
  if (paginaActual < Math.ceil(usuarios.length / cantidadPorPagina)) {
    paginaActual++;
    mostrarUsuarios(usuarios);
  }
});

ultimaPaginaBtn.addEventListener("click", () => {
  paginaActual = Math.ceil(usuarios.length / cantidadPorPagina);
  mostrarUsuarios(usuarios);
});

// Actualiza el estado de los botones de paginación
const actualizarBotonesPaginacion = () => {
  const totalPaginas = Math.ceil(usuarios.length / cantidadPorPagina);

  // Deshabilita los botones de "primera página" y "página anterior" si estás en la primera página
  primeraPaginaBtn.disabled = paginaActual === 1;
  paginaAnteriorBtn.disabled = paginaActual === 1;

  // Deshabilita los botones de "próxima página" y "última página" si estás en la última página
  proximaPaginaBtn.disabled = paginaActual === totalPaginas;
  ultimaPaginaBtn.disabled = paginaActual === totalPaginas;
};

// Modal
const abrirModal = (usuario, fechaNacimiento) => {
  const modal = document.getElementById("modalUsuario");
  modal.innerHTML = "";

  // Crea elementos del modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const contenedorAvatarModal = document.createElement("div");
  contenedorAvatarModal.innerHTML = `
      <img src="${usuario.picture.large}" alt="Imágen del Usuario" class="modal-img">
  `;
  modalContent.appendChild(contenedorAvatarModal);

  const contenedorInfoModal = document.createElement("div");
  contenedorInfoModal.classList.add("contenedorInfo");

  // Información adicional para el modal
  const formatoFechaNacimiento = `${fechaNacimiento.getDate()} - ${
    fechaNacimiento.getMonth() + 1
  } - ${fechaNacimiento.getFullYear()}`;

  contenedorInfoModal.innerHTML = `
      <h2 style="color: #71202c; margin: 10px 0px; text-align: center; background-color: #d59495; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; border-radius: 5px">${
        usuario.name.first
      } ${usuario.name.last}</h2>
      <p><strong>Género:</strong> ${
        usuario.gender === "female" ? "Mujer" : "Hombre"
      }</p>
      <p><strong>Fecha de Nacimiento:</strong> ${formatoFechaNacimiento}</p>
      <p><strong>Años:</strong> ${usuario.dob.age}</p>
      <p><strong>Nacionalidad:</strong> ${
        usuario.nat === "AU"
          ? "Australiana"
          : "" || usuario.nat === "BR"
          ? "Brasileña"
          : "" || usuario.nat === "CA"
          ? "Canadiense"
          : "" || usuario.nat === "CH"
          ? "Suiza"
          : "" || usuario.nat === "DE"
          ? "Alemana"
          : "" || usuario.nat === "DK"
          ? "Danesa"
          : "" || usuario.nat === "ES"
          ? "Española"
          : "" || usuario.nat === "FI"
          ? "Finlandesa"
          : "" || usuario.nat === "FR"
          ? "Francesa"
          : "" || usuario.nat === "GB"
          ? "Británica"
          : "" || usuario.nat === "IE"
          ? "Irlandesa"
          : "" || usuario.nat === "IN"
          ? "India"
          : "" || usuario.nat === "IR"
          ? "Iraní"
          : "" || usuario.nat === "MX"
          ? "Mexicana"
          : "" || usuario.nat === "NL"
          ? "Neerlandesa"
          : "" || usuario.nat === "NO"
          ? "Noruega"
          : "" || usuario.nat === "NZ"
          ? "Neozelandesa"
          : "" || usuario.nat === "RS"
          ? "Serbia"
          : "" || usuario.nat === "TR"
          ? "Turca"
          : "" || usuario.nat === "UA"
          ? "Ucraniana"
          : "" || usuario.nat === "US"
          ? "Estadounidense"
          : ""
      }</p>
      <p><strong>Dirección:</strong> ${usuario.location.street.number} ${
    usuario.location.street.name
  }, ${usuario.location.city}, ${usuario.location.state}</p>      
      <p><strong>Teléfono Fijo:</strong> ${usuario.phone}</p>
      <p><strong>Celular:</strong> ${usuario.cell}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>     
      
      <button onclick="cerrarModal()">Volver</button>
  `;
  modalContent.appendChild(contenedorInfoModal);

  modal.appendChild(modalContent);
  modal.style.display = "flex";
};

const cerrarModal = () => {
  const modal = document.getElementById("modalUsuario");
  modal.style.display = "none";
};

// Año del Footer
const anioActualElement = document.getElementById("anioActual");

// Obtiene el año actual
const anioActual = new Date().getFullYear();

// Actualiza el contenido del elemento con el año actual
anioActualElement.textContent = anioActual;
