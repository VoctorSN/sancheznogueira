import { ref } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoPng from '@/assets/logo.png'

export function usePdfGenerator() {
  const procesando = ref(false)

  const generarPdfFactura = (factura, nombreArchivo = 'factura.pdf') => {
    if (!factura) {
      console.error('❌ No hay factura para generar PDF.')
      return
    }

    procesando.value = true

    try {
      const doc = new jsPDF()
      const cart = factura.items

      // Logo en la parte superior izquierda
      doc.addImage(logoPng, 'PNG', 10, 10, 30, 30)

      // Título de la factura
      doc.setFontSize(18)
      doc.text('Factura de Compra', 60, 20)

      // Información del cliente
      doc.setFontSize(9)
      doc.text('Razón Social: Regalos Teis', 110, 50)
      doc.text('Dirección: Avenida Galicia 101, Vigo - 36216', 110, 55)
      doc.text('Tlfo: 986 666 333 - Email: regalos@example.com', 110, 60)

      // Crear la tabla con los productos del carrito
      const headers = [['ID', 'Producto', 'Cantidad', 'Precio Unitario', 'Total']]
      const data = cart.map((item) => [
        item.productoId || item.id,
        item.nombre,
        item.cantidad,
        `${item.precio.toFixed(2)} €`,
        `${(item.cantidad * item.precio).toFixed(2)} €`
      ])

      autoTable(doc, {
        startY: 80,
        head: headers,
        body: data,
        columnStyles: {
          0: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        theme: 'striped'
      })

      // Total de la compra (alineado a la derecha)
      const totalText = `Total: ${factura.totalFactura.toFixed(2)} €`

      // Obtener el ancho de la página
      const pageWidth = doc.internal.pageSize.width

      // Calcular la posición X para alinear a la derecha
      const totalWidth = doc.getTextWidth(totalText)
      const positionX = pageWidth - totalWidth - 14

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)

      // Colocar el texto en la posición calculada
      doc.text(totalText, positionX - 9, doc.lastAutoTable.finalY + 10)

      // Guardar el archivo PDF
      doc.save(nombreArchivo)
    } catch (error) {
      console.error('Error al generar PDF:', error)
      throw error
    } finally {
      procesando.value = false
    }
  }

  const generarPdfListadoClientes = (clientes, nombreArchivo = 'listado_clientes.pdf') => {
    if (!clientes || clientes.length === 0) {
      console.error('❌ No hay clientes para generar PDF.')
      return
    }

    procesando.value = true

    try {
      const doc = new jsPDF()

      // Obtener fecha y hora actual
      const ahora = new Date()
      const fechaHora = ahora.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      // Encabezado con título principal
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(41, 128, 185) // Azul
      doc.text('Listado de Clientes', 105, 20, { align: 'center' })

      // Fecha y hora
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(`Generado: ${fechaHora}`, 105, 28, { align: 'center' })

      // Línea decorativa
      doc.setDrawColor(41, 128, 185)
      doc.setLineWidth(0.5)
      doc.line(14, 32, 196, 32)

      // Definir las columnas de la tabla
      const headers = [['DNI', 'Nombre', 'Email', 'Provincia', 'Municipio']]

      // Definir las filas de la tabla
      const body = clientes.map((cliente) => [
        cliente.dni,
        cliente.nombre,
        cliente.email,
        cliente.provincia,
        cliente.municipio,
      ])

      // Generar la tabla con estilos mejorados
      autoTable(doc, {
        startY: 38,
        head: headers,
        body: body,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185], // Azul
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 4,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Gris claro para filas alternas
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'left' },
          2: { halign: 'left' },
        },
        styles: {
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        margin: { left: 14, right: 14 },
      })

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `Página ${i} de ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
      }

      // Guardar el PDF con fecha y hora española
      const fechaArchivo = ahora.toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/[/:]/g, '-').replace(/,/g, '').replace(/ /g, '_')
      
      doc.save(`${nombreArchivo.replace('.pdf', '')}_${fechaArchivo}.pdf`)
    } catch (error) {
      console.error('Error al generar PDF de listado de clientes:', error)
      throw error
    } finally {
      procesando.value = false
    }
  }

  const generarPdfListadoVehiculos = (vehiculos, nombreArchivo = 'listado_vehiculos.pdf') => {
    if (!vehiculos || vehiculos.length === 0) {
      console.error('❌ No hay vehículos para generar PDF.')
      return
    }

    procesando.value = true

    try {
      const doc = new jsPDF()

      // Obtener fecha y hora actual
      const ahora = new Date()
      const fechaHora = ahora.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      // Encabezado con título principal
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(41, 128, 185) // Azul
      doc.text('Listado de Vehículos', 105, 20, { align: 'center' })

      // Fecha y hora
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(`Generado: ${fechaHora}`, 105, 28, { align: 'center' })

      // Línea decorativa
      doc.setDrawColor(41, 128, 185)
      doc.setLineWidth(0.5)
      doc.line(14, 32, 196, 32)

      // Definir las columnas de la tabla
      const headers = [['Matrícula', 'Marca', 'Modelo', 'Estado', 'Combustible', 'Precio']]

      // Definir las filas de la tabla
      const body = vehiculos.map((vehiculo) => [
        vehiculo.matricula,
        vehiculo.marca,
        vehiculo.modelo,
        vehiculo.estado,
        vehiculo.combustible,
        vehiculo.precio + ' €',
      ])

      // Generar la tabla con estilos mejorados
      autoTable(doc, {
        startY: 38,
        head: headers,
        body: body,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185], // Azul
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 4,
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245], // Gris claro para filas alternas
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'left' },
          2: { halign: 'left' },
          5: { halign: 'right' },
        },
        styles: {
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        margin: { left: 14, right: 14 },
      })

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `Página ${i} de ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
      }

      // Guardar el PDF con fecha y hora española
      const fechaArchivo = ahora.toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/[/:]/g, '-').replace(/,/g, '').replace(/ /g, '_')
      
      doc.save(`${nombreArchivo.replace('.pdf', '')}_${fechaArchivo}.pdf`)
    } catch (error) {
      console.error('Error al generar PDF de listado de vehículos:', error)
      throw error
    } finally {
      procesando.value = false
    }
  }

  return {
    procesando,
    generarPdfFactura,
    generarPdfListadoClientes,
    generarPdfListadoVehiculos
  }
}
