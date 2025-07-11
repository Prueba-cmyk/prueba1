
var donations = JSON.parse(localStorage.getItem('donations')) || [];
var generalComments = JSON.parse(localStorage.getItem('generalComments')) || [];
var imagenDonacionBase64 = null;

function saveData() {
    localStorage.setItem('donations', JSON.stringify(donations));
    localStorage.setItem('generalComments', JSON.stringify(generalComments));
}


function registrarDonacion() {
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var country = document.getElementById('country').value;
    var city = document.getElementById('city').value;
    var comment = document.getElementById('comment').value;

    if (!username || !email || !country || !city) {
        alert("Por favor, completa todos los campos de texto obligatorios.");
        return;
    }
    if (imagenDonacionBase64 == null) {
        alert("Por favor, selecciona o toma una foto del artículo.");
        return;
    }

    var newDonation = {
        username: username,
        email: email,
        imageUrl: imagenDonacionBase64,
        country: country,
        city: city,
        comment: comment,
        donated: false
    };
    
    donations.push(newDonation);
    saveData(); 
    alert("¡Gracias, " + username + "! Tu donación ha sido registrada con éxito.");
    document.getElementById('donation-form').reset();
    document.getElementById('image-preview').src = "";
    imagenDonacionBase64 = null;
    actualizarCatalogo();
    actualizarRegistroDonaciones();
    showSection('catalogo');
}

function handleFileSelect(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {

        var preview = document.getElementById('image-preview');
        preview.src = e.target.result;
        

        imagenDonacionBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('gallery-input').addEventListener('change', handleFileSelect);
document.getElementById('camera-input').addEventListener('change', handleFileSelect);


function showSection(sectionId) {
    var sections = document.getElementsByClassName('seccion-contenido');
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
    document.getElementById('inicio').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

function mostrarInfoDonante(index) {
    var item = donations[index];
    var info = "Información del Donante:\n\nUsuario: " + item.username + "\nPaís: " + item.country + "\nCiudad: " + item.city;
    alert(info);
}

function solicitarDonacion(index) {
    if (donations[index].donated) {
        alert("Este artículo ya fue solicitado anteriormente.");
    } else {
        donations[index].donated = true;
        alert("¡Has solicitado el artículo con éxito! El donante será notificado.");
        saveData();
        actualizarCatalogo();
        actualizarRegistroDonaciones(); 
    }
}

function actualizarCatalogo() {
    var catalogoContainer = document.getElementById('catalogo-grid');
    var htmlContent = "";
    for (var i = 0; i < donations.length; i++) {
        var item = donations[i];
        var botonHtml = item.donated 
            ? '<button class="boton-donado">Este artículo ya fue donado</button>'
            : '<button onclick="solicitarDonacion(' + i + ')">Solicitar</button>';

        htmlContent += '<div class="catalogo-item">' +
                       '  <img src="' + item.imageUrl + '" onclick="mostrarInfoDonante(' + i + ')">' +
                       '  <h3>' + item.country + '</h3>' +
                       '  <p class="donation-comment">"' + (item.comment ? item.comment : "Sin comentario") + '"</p>' +
                       botonHtml +
                       '</div>';
    }
    catalogoContainer.innerHTML = htmlContent;
}


function addGeneralComment() {
    var commentUsername = document.getElementById('comment-username').value;
    var generalCommentText = document.getElementById('general-comment').value;

    if (!commentUsername || !generalCommentText) {
        alert("Por favor, ingresa tu nombre y tu comentario.");
        return;
    }

    var newGeneralComment = {
        username: commentUsername,
        comment: generalCommentText
    };
    generalComments.push(newGeneralComment);

    saveData();
    alert("Tu comentario ha sido publicado.");


    document.getElementById('general-comment-form').reset();
    actualizarRegistroDonaciones(); 
}

function actualizarRegistroDonaciones() {
    var registroContainer = document.getElementById('registro-info');
    var comentariosContainer = document.getElementById('comentarios-generales');
    var totalDonaciones = donations.length;
    var donacionesRealizadas = 0;
    for(var i=0; i < donations.length; i++){ if(donations[i].donated){ donacionesRealizadas++; } }
    
    var registroHtml = "<h3>Estadísticas Generales</h3>" + "<p>Total de artículos registrados: " + totalDonaciones + "</p>" + "<p>Total de artículos ya donados: " + donacionesRealizadas + "</p>" + "<br><h3>Lista de Donaciones Registradas:</h3>";
    
    for (var i = 0; i < donations.length; i++) {
        var item = donations[i];
        var estado = item.donated ? "Donado" : "Disponible";
        registroHtml += "<p><b>" + (i+1) + ". Donante:</b> " + item.username + " (" + item.country + ") - <b>Estado:</b> " + estado + "</p>";
    }
    registroContainer.innerHTML = registroHtml;

    var comentariosHtml = "";
    for (var i = 0; i < generalComments.length; i++) {
        var comment = generalComments[i];
        comentariosHtml += "<p><b>" + comment.username + " comentó:</b><i> \"" + comment.comment + "\"</i></p>";
    }
    comentariosContainer.innerHTML = comentariosHtml;
}

window.onload = function() {
    actualizarCatalogo();
    actualizarRegistroDonaciones();
    showSection('inicio');
};