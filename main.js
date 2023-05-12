$(function () {
  ///// Funciones drag and drop para PC
  $(".contenedor").on("dragover", function (ev) {
    ev.preventDefault();
  });
  $(".draggable").on("dragstart", function (ev) {
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
  });
  $(".contenedor").on("drop", function (ev) {
    ev.preventDefault();
    var data = ev.originalEvent.dataTransfer.getData("text");
    $("#" + data).appendTo($(ev.target));
  });
  ///// Funciones drag and drop (de imágenes) para dispositivo móvil
  // Se oculta la imagen del DOM
  $("#auxiliar").hide();
  var timer;
  // Tiempo mínimo del touch sostenido para considerarse como un arrastre
  var touchDuration = 500;
  // Indicador de drag and drop en dispositivos móviles
  var dragMobile = false;
  // Elemento que está siendo arrastrado
  var element;
  // Inicio del arrastre
  $(".draggable").on("touchstart", function (ev) {
    // Se captura el elemento sobre el que se inicia el evento touch
    element = this;
    timer = setTimeout(function () {
      // Se asigna el elemento src a la imagen auxiliar
      $("#auxiliar").attr("src", $(element).attr("src"));
      // Se indica que se ha iniciado el dragging en dispositivo móvil
      dragMobile = true;
    }, touchDuration);
    ev.preventDefault();
  });
  // Lo que sucede durante el arrastre
  $(".draggable").on("touchmove", function (ev) {
    // Obtiene las coordenadas del touching
    var touch = ev.originalEvent.touches["0"];
    // Valida si se ha iniciado un arrastre en dispositivo móvil
    if (dragMobile) {
      // Se modifica la posición de la imagen auxiliar con opacidad al 80%
      // que sigue el movimiento del dedo a lo largo de la pantalla
      $("#auxiliar").css({
        top: touch.pageY - 100,
        left: touch.pageX - 100,
        opacity: 0.8,
        display: "block",
        position: "absolute",
      });
    }
  });
  // Lo que sucede cuando se finaliza el arrastre
  $(".draggable").on("touchend", function (ev) {
    // Se reinicia el timer que controla el tiempo mínimo que debe transcurrir
    // para considerarse un arrastre en dispositivo móvil
    if (timer) {
      clearTimeout(timer);
    }
    // Se valida que se haya capturado el elemento arrastrado
    if (element) {
      // Se valida que el elemento sea arrastrable y que se haya iniciado
      if (dragMobile) {
        ev.preventDefault();
        ev.stopPropagation();
        // Se oculta la imagen auxiliar de arrastre
        $("#auxiliar").hide();
        var changedTouch = event.changedTouches[0];
        // Obtiene el elemento sobre el que se finaliza el evento touch
        var elem = document.elementFromPoint(
          changedTouch.clientX,
          changedTouch.clientY
        );
        // Se valida que el elemento contenga la clase contenedor
        // es requisito para permitir el soltar el elemento que posea esta clase
        if ($(elem).hasClass("contenedor")) {
          // Agrega el elemento arrastrado al elemento donde finaliza el evento touch
          $(element).appendTo("#" + elem.id);
        }
        // Se pone en falso la bandera que indica que se ha finalizado el evento
        // drag and drop en mobile
        dragMobile = false;
      }
    }
  });
});
