document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const messageBox = document.getElementById("messageBox");

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();

        // Validación de longitud (mínimo 5, máximo 20 caracteres)
        if (taskText.length < 5) {
            showMessage("La tarea debe tener al menos 5 caracteres.", "error");
            return;
        }
        if (taskText.length > 30) {
            showMessage("La tarea no puede superar los 30 caracteres.", "error");
            return;
        }

        // Crear el elemento de la tarea
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");

        // Evento para eliminar la tarea
        deleteBtn.addEventListener("click", function () {
            taskItem.remove();
            showMessage("Tarea eliminada correctamente.", "success");
        });

        // Agregar elementos a la lista
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        // Limpiar input y mostrar mensaje de éxito
        taskInput.value = "";
        showMessage("Tarea añadida con éxito.", "success");
    });

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = "message " + type;
        
        setTimeout(() => {
            messageBox.textContent = "";
            messageBox.className = "message";
        }, 3000);
    }
});

// Asegúrate de que este script se carga después de config.js y que emailjs está disponible

document.addEventListener("DOMContentLoaded", function () {
  if (!window.emailjs) {
      console.error("EmailJS no está definido. Asegúrate de incluir la librería en tu HTML.");
      return;
  }

  emailjs.init(config.emailjs.publicKey);

  const button = document.querySelector(".contact-form button");
  const form = document.querySelector(".contact-form");
  
  if (!button || !form) {
      console.error("No se encontró el formulario o el botón de enviar.");
      return;
  }

  // Crear el span para los mensajes
  const statusMessage = document.createElement("span");
  statusMessage.style.display = "block";
  statusMessage.style.marginTop = "10px";
  form.appendChild(statusMessage);

  button.addEventListener("click", function (event) {
      event.preventDefault(); // Evita que el formulario se recargue

      // Obtener los valores del formulario
      const nameField = document.querySelector(".contact-form input[placeholder='Nombre']");
      const phoneField = document.querySelector(".contact-form input[placeholder='Teléfono']");
      const emailField = document.querySelector(".contact-form input[placeholder='Correo']");
      const messageField = document.querySelector(".contact-form textarea");

      if (!nameField || !phoneField || !emailField || !messageField) {
          console.error("Uno o más campos del formulario no fueron encontrados.");
          return;
      }

      const name = nameField.value.trim();
      const phone = phoneField.value.trim();
      const email = emailField.value.trim();
      const message = messageField.value.trim();

      // Validaciones
      if (name.length < 2 || name.length > 50) {
          statusMessage.textContent = "El nombre debe tener entre 2 y 50 caracteres.";
          statusMessage.style.color = "red";
          return;
      }

      if (!/^[0-9]+$/.test(phone)) {
          statusMessage.textContent = "El teléfono solo debe contener números.";
          statusMessage.style.color = "red";
          return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          statusMessage.textContent = "Por favor, introduce un correo válido.";
          statusMessage.style.color = "red";
          return;
      }

      const wordCount = message.split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 5 || wordCount > 300) {
          statusMessage.textContent = "El mensaje debe tener entre 5 y 300 palabras.";
          statusMessage.style.color = "red";
          return;
      }

      // Deshabilitar botón temporalmente
      button.disabled = true;
      button.textContent = "Cargando...";
      button.style.backgroundColor = "#ccc";

      // Configurar los parámetros para EmailJS
      const templateParams = {
          name: name,
          phone: phone,
          email: email,
          message: message,
          system_date: new Date().toLocaleString()
      };

      // Enviar el correo usando EmailJS
      emailjs.send(config.emailjs.serviceId, config.emailjs.templateId, templateParams)
          .then(function (response) {
              statusMessage.textContent = "Mensaje enviado correctamente.";
              statusMessage.style.color = "green";
              console.log("Éxito:", response);
              form.reset(); // Limpia el formulario
          }, function (error) {
              statusMessage.textContent = "Error al enviar el mensaje.";
              statusMessage.style.color = "red";
              console.log("Error:", error);
          })
          .finally(() => {
              setTimeout(() => {
                  button.disabled = false;
                  button.textContent = "Enviar";
                  button.style.backgroundColor = "";
              }, 2000);
          });
  });
});
