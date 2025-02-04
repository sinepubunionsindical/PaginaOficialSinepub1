document.addEventListener('DOMContentLoaded', function() {
    const listaCargos = document.querySelector('.lista-cargos');
    const miembroFoto = document.getElementById('miembro-foto');
    const miembroNombre = document.getElementById('miembro-nombre');
    const miembroCargo = document.getElementById('miembro-cargo');
    const cargosListItems = listaCargos.querySelectorAll('li');

    // Datos de ejemplo de la Junta Directiva - ¡¡¡¡¡REEMPLAZADO CON RUTAS DE IMAGEN CORRECTAS!!!!!
    const juntaDirectivaData = {
        presidente: { nombre: "Jenny Patricia Ricaurte Zuluaga", cargo: "Presidente", foto: "images/junta1.jpg" },        // junta1.jpg
        vicepresidente: { nombre: "Luis Fernando Van Pacheco Agredo", cargo: "Vicepresidente", foto: "images/junta2.jpg" },     // junta2.jpg
        tesorera: { nombre: "Leidy Cecilia Hernández Acevedo", cargo: "Tesorera (E) - Secret. Humanización y DDHH", foto: "images/junta3.jpg" }, // junta3.jpg
        fiscal: { nombre: "Edith Medina Conde", cargo: "Fiscal", foto: "images/junta4.jpg" },          // junta4.jpg
        "secretario-salud-ocupacional": { nombre: "Luis Carlos Calderón", cargo: "Secretario Salud Ocupacional", foto: "images/junta5.jpg" }, // junta5.jpg
        "secretaria-carrera-administrativa": { nombre: "Martha Cecilia Solarte Caicedo", cargo: "Secretaria de Carrera Administrativa", foto: "images/junta6.jpg" }, // junta6.jpg
        "secretaria-reclamos": { nombre: "Patricia Salazar Morales", cargo: "Secretaria de Reclamos y Solución de Conflictos", foto: "images/junta7.jpg" }, // junta7.jpg
        "secretaria-general": { nombre: "Leydy Yohana González Ulabarry", cargo: "Secretaria General", foto: "images/junta8.jpg" },    // junta8.jpg
    };

    // Función para actualizar la vista dinámica con la información del miembro
    function actualizarVistaMiembro(cargo) {
        const miembro = juntaDirectivaData[cargo];
        if (miembro) {
            miembroFoto.src = miembro.foto;
            miembroNombre.textContent = miembro.nombre;
            miembroCargo.textContent = miembro.cargo;
        } else {
            // Si no se encuentra información para el cargo, mostrar placeholder
            miembroFoto.src = "images/placeholder-miembro.jpg";
            miembroNombre.textContent = "Información no disponible";
            miembroCargo.textContent = "Cargo no encontrado";
        }
    }

    // Event listeners para cada item de la lista de cargos
    cargosListItems.forEach(item => {
        item.addEventListener('click', function() {
            const cargoSeleccionado = this.dataset.cargo; // Obtener el cargo del atributo data-cargo
            actualizarVistaMiembro(cargoSeleccionado); // Actualizar la vista dinámica con la información del cargo
            
            // Remover la clase 'active' de todos los items y activarla solo en el item clickeado
            cargosListItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active'); // Añadir clase 'active' al item clickeado
        });
    });

    // Mostrar la información del primer cargo por defecto al cargar la página (Presidente)
    actualizarVistaMiembro('presidente');
    cargosListItems[0].classList.add('active'); // Activar el primer item (Presidente) inicialmente
});