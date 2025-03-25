// Variables para almacenar las imágenes
let imagenPrincipal = null;
let imagenSecundaria = null;

// Función para mostrar vista previa de las imágenes
function mostrarVistaPrevia(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewDiv = document.getElementById(previewId);
            previewDiv.innerHTML = '';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'h-full w-auto mx-auto object-contain';
            
            previewDiv.appendChild(img);
            
            // Almacenar la imagen
            if (previewId === 'preview_imagen_principal') {
                imagenPrincipal = e.target.result;
            } else if (previewId === 'preview_imagen_secundaria') {
                imagenSecundaria = e.target.result;
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Configurar listeners para los inputs de imágenes
document.querySelector('input[name="imagen_principal"]').addEventListener('change', function() {
    mostrarVistaPrevia(this, 'preview_imagen_principal');
});

document.querySelector('input[name="imagen_secundaria"]').addEventListener('change', function() {
    mostrarVistaPrevia(this, 'preview_imagen_secundaria');
});

// Prevenir el envío del formulario por defecto
document.getElementById('especificacionesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Datos guardados correctamente.');
});

// Generar PDF
document.getElementById('generarPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    
    // Crear nuevo documento PDF
    const doc = new jsPDF();
    
    // Función para obtener el valor seleccionado de un grupo de radio buttons
    function getRadioValue(name) {
        const radios = document.getElementsByName(name);
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return '';

        
    }
    
    // Función para obtener el valor de un campo de texto
    function getTextValue(name) {
        return document.getElementsByName(name)[0].value;
    }
    
    // Configurar encabezado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PIGORE INGENIERÍA, S.A. DE C.V.', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('ALIMENTADORES VIBRATORIOS Y CENTRÍFUGOS', 105, 28, { align: 'center' });
    
    // Información general
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información General', 15, 40);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${getTextValue('fecha')}`, 15, 48);
    doc.text(`No. de Proyecto: ${getTextValue('proyecto')}`, 105, 48);
    doc.text(`Cliente: ${getTextValue('cliente')}`, 15, 56);
    doc.text(`Responsable: ${getTextValue('responsable')}`, 105, 56);
    
    // Añadir imágenes si existen
    let currentY = 65;
    if (imagenPrincipal) {
        doc.addImage(imagenPrincipal, 'JPEG', 15, currentY, 80, 40);
        currentY += 45;
    }
    
    if (imagenSecundaria) {
        doc.addImage(imagenSecundaria, 'JPEG', 110, 65, 80, 40);
    }
    
    // Sección a) Especificaciones técnicas
    currentY += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('a) Especificaciones técnicas', 15, currentY);
    currentY += 10;
    
    const especificacionesData = [
        ['Característica', 'Cumple'],
        ['Altura del Tazón', getRadioValue('altura_tazon')],
        ['Distancia entre centro del tazón al centro de la tangente', getRadioValue('distancia_centro')],
        ['Inclinación de la tangente', getRadioValue('inclinacion_tangente')],
        ['Longitud de tangente', getRadioValue('longitud_tangente')],
        ['Barreno central', getRadioValue('barreno_central')],
        ['Tornillería', getRadioValue('tornilleria')],
        ['Placa para sensor de peso', getRadioValue('placa_sensor')],
        ['Ubicación de la ranura y charola para evacuación de basura', getRadioValue('ranura_charola')]
    ];
    
    doc.autoTable({
        startY: currentY,
        head: [especificacionesData[0]],
        body: especificacionesData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204] }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const obsEspecificaciones = getTextValue('obs_especificaciones');
    const obsEspecificacionesLines = doc.splitTextToSize(obsEspecificaciones, 180);
    doc.text(obsEspecificacionesLines, 15, currentY + 8);
    
    currentY += 8 + (obsEspecificacionesLines.length * 5);
    
    // Verificar si necesitamos una nueva página
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }
    
    // Sección b) Calidad y seguridad
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('b) Calidad y seguridad', 15, currentY);
    currentY += 10;
    
    const calidadData = [
        ['Característica', 'Cumple'],
        ['Filos', getRadioValue('filos')],
        ['Soldadura', getRadioValue('soldadura')],
        ['Manchas de decapante', getRadioValue('manchas_decapante')],
        ['Acabado general', getRadioValue('acabado_general')]
    ];
    
    doc.autoTable({
        startY: currentY,
        head: [calidadData[0]],
        body: calidadData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204] }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const obsCalidad = getTextValue('obs_calidad');
    const obsCalidadLines = doc.splitTextToSize(obsCalidad, 180);
    doc.text(obsCalidadLines, 15, currentY + 8);
    
    currentY += 8 + (obsCalidadLines.length * 5);
    
    // Verificar si necesitamos una nueva página
    if (currentY > 250) {
        doc.addPage();
        currentY = 20;
    }
    
    // Sección c) Funcionalidad
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('c) Funcionalidad', 15, currentY);
    currentY += 10;
    
    const funcionalidadData = [
        ['Característica', 'Cumple'],
        ['Piezas por minuto', getRadioValue('piezas_minuto')],
        ['Cadencia del equipo', getRadioValue('cadencia_equipo')],
        ['Mantener vibración uniforme', getRadioValue('vibracion_uniforme')],
        ['Ajuste de Contrapesos', getRadioValue('ajuste_contrapesos')],
        ['Implementaciones de soluciones mecánicas', getRadioValue('soluciones_mecanicas')],
        ['Vaciado de tazón', getRadioValue('vaciado_tazon')],
        ['Pruebas de estrés', getRadioValue('pruebas_estres')],
        ['Trampas', getRadioValue('trampas')]
    ];
    
    doc.autoTable({
        startY: currentY,
        head: [funcionalidadData[0]],
        body: funcionalidadData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204] }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', 15, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const obsFuncionalidad = getTextValue('obs_funcionalidad');
    const obsFuncionalidadLines = doc.splitTextToSize(obsFuncionalidad, 180);
    doc.text(obsFuncionalidadLines, 15, currentY + 8);
    
    // Añadir pie de página
    doc.setFontSize(8);
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${totalPages}`, 105, 290, { align: 'center' });
        doc.text(`PIGORE INGENIERÍA, S.A. DE C.V. - Documento generado el ${new Date().toLocaleDateString()}`, 105, 295, { align: 'center' });
    }
    
    // Guardar PDF
    doc.save(`Especificaciones_Tecnicas_${getTextValue('proyecto')}.pdf`);
});