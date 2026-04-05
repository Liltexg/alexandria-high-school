import { jsPDF } from 'jspdf';
import { LOGO_URI } from './logo';

export const generateApplicationPDF = async (formData, referenceNumber) => {
    const doc = jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const contentWidth = pageWidth - (margin * 2);

    // Helper functions
    const drawSectionHeader = (text, y) => {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.rect(margin, y, contentWidth, 6, 'S');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(text, pageWidth / 2, y + 4.5, { align: 'center' });
    };

    const drawGridCell = (x, y, w, h, label, value, bold = false) => {
        doc.setLineWidth(0.2);
        doc.rect(x, y, w, h, 'S');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label, x + 1, y + 3);

        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(8);
        const valText = (value !== null && value !== undefined) ? String(value) : '';
        doc.text(valText, x + 5, y + (h - 2));
    };

    const drawCheckboxes = (x, y, label, options, selectedValue) => {
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label, x, y);

        let curX = x + (label ? 25 : 0);
        options.forEach(opt => {
            const isSelected = String(selectedValue).toLowerCase() === String(opt.value).toLowerCase();
            doc.rect(curX, y - 3, 3, 3, 'S');
            if (isSelected) {
                doc.line(curX, y - 3, curX + 3, y);
                doc.line(curX + 3, y - 3, curX, y);
            }
            doc.setFont('helvetica', 'normal');
            doc.text(opt.label, curX + 5, y);
            curX += 28;
        });
    };

    // Page number helper
    const drawPageNumber = (pageNumber) => {
        const totalPages = doc.internal.getNumberOfPages();
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${pageNumber}`, pageWidth / 2, 287, { align: 'center' });
        doc.setTextColor(0);
    };

    const checkPageBreak = (neededHeight) => {
        if (currentY + neededHeight > 275) {
            drawPageNumber(doc.internal.getNumberOfPages());
            doc.addPage();
            currentY = 20; // reset to top margin
            return true;
        }
        return false;
    };

    // --- Page 1 ---

    // Header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Alexandria High School', margin, 15);
    doc.setFont('helvetica', 'normal');
    doc.text('P. O. Box 43', margin, 19);
    doc.text('ALEXANDRIA', margin, 23);
    doc.text('6185', margin, 27);
    doc.text('Cell: 063 652 0546', margin, 31);

    doc.setFont('helvetica', 'bold');
    doc.text('Hoërskool Alexandria', pageWidth - margin - 35, 15, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.text('Posbus 43', pageWidth - margin - 35, 19);
    doc.text('ALEXANDRIA', pageWidth - margin - 35, 23);
    doc.text('6185', pageWidth - margin - 35, 27);
    doc.setFontSize(8);
    doc.text('E-mail Addresses:', pageWidth - margin - 35, 31);
    doc.setTextColor(50, 50, 200);
    doc.text('alexandriahigh6185@gmail.com', pageWidth - margin - 45, 35);
    doc.setTextColor(0);

    // Logo
    if (LOGO_URI) {
        try {
            doc.addImage(LOGO_URI, 'PNG', (pageWidth / 2) - 12.5, 10, 25, 25);
        } catch (e) {
            doc.setDrawColor(200);
            doc.circle(pageWidth / 2, 22, 12, 'S');
        }
    }

    doc.setLineWidth(0.5);
    doc.line(margin, 40, pageWidth - margin, 40);

    // Title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION FOR ADMISSION TO SCHOOL / AANSOEK OM TOELATING TOT SKOOL', pageWidth / 2, 48, { align: 'center' });
    doc.text(`YEAR / JAAR: ${formData.intake_year || '2027'}`, pageWidth / 2, 53, { align: 'center' });

    // Office Use Only
    let currentY = 58;
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 18);
    doc.setFontSize(8);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, currentY, contentWidth, 4, 'F');
    doc.text('FOR OFFICE USE ONLY / SLEGS VIR KANTOORGEBRUIK', pageWidth / 2, currentY + 3, { align: 'center' });

    doc.line(margin + 45, currentY + 4, margin + 45, currentY + 18);
    doc.line(margin + 90, currentY + 4, margin + 90, currentY + 18);
    doc.line(margin, currentY + 11, margin + 90, currentY + 11);

    doc.setFontSize(7);
    doc.text('Accepted / Aanvaar:', margin + 1, currentY + 7);
    doc.text('Date accepted / Datum aanvaar:', margin + 46, currentY + 7);
    doc.text('Admission No. / Toelatingsnr.:', margin + 91, currentY + 7);
    doc.text('Not accepted / Nie aanvaar:', margin + 1, currentY + 14);
    doc.text('Reason / Rede:', margin + 46, currentY + 14);

    currentY += 22;

    // Notice text
    doc.setFontSize(6);
    doc.setFont('helvetica', 'italic');
    doc.text('NOTE: This form must be completed in full. All changes to be initialed or signed by parent / guardian.', margin, currentY);
    doc.text('NOTA: Hierdie vorm moet volledig ingevul word. By alle veranderinge moet daar geparafeer of geteken word deur die ouer / voog.', margin, currentY + 4);

    currentY += 10;

    // LEARNER INFORMATION
    drawSectionHeader('LEARNER INFORMATION / LEERDER INLIGTING:', currentY);
    currentY += 6;

    drawGridCell(margin, currentY, 110, 8, 'Grade applied for / Graad:', formData.grade_applying_for);
    drawGridCell(margin + 110, currentY, 80, 8, 'Ref / Verw:', referenceNumber, true);
    currentY += 8;

    drawGridCell(margin, currentY, 130, 8, 'Home Language / Huistaal:', formData.home_language);
    drawGridCell(margin + 130, currentY, 60, 8, 'Year Passed / Jaar geslaag:', (parseInt(formData.intake_year) - 1).toString());
    currentY += 8;

    doc.rect(margin, currentY, contentWidth, 8);
    doc.text('Preferred Language of Instruction / Taal van onderrig:', margin + 1, currentY + 5);
    drawCheckboxes(margin + 120, currentY + 5, '', [
        { label: 'Afrikaans', value: 'Afrikaans' },
        { label: 'English', value: 'English' }
    ], formData.preferred_language);
    currentY += 8;

    doc.rect(margin, currentY, contentWidth, 8);
    doc.text('Boarder / Koshuisleerder:', margin + 1, currentY + 5);
    drawCheckboxes(margin + 120, currentY + 5, '', [
        { label: 'Yes / Ja', value: 'true' },
        { label: 'No / Nee', value: 'false' }
    ], String(formData.is_boarder));
    currentY += 8;

    drawGridCell(margin, currentY, 130, 10, 'Surname / Van:', formData.learner_surname, true);
    drawGridCell(margin + 130, currentY, 60, 10, 'Date of Birth:', formData.date_of_birth);
    currentY += 10;

    drawGridCell(margin, currentY, 130, 10, 'First Name / Geboortenaam:', formData.learner_first_name);
    drawGridCell(margin + 130, currentY, 60, 10, 'ID Number / ID Nommer:', formData.id_number);
    currentY += 10;

    doc.rect(margin, currentY, contentWidth, 10);
    doc.text('Gender / Geslag:', margin + 1, currentY + 6);
    drawCheckboxes(margin + 60, currentY + 6, '', [
        { label: 'Male / Manlik', value: 'Male' },
        { label: 'Female / Vroulik', value: 'Female' }
    ], formData.gender);
    currentY += 10;

    drawGridCell(margin, currentY, 60, 10, 'Citizenship:', formData.citizenship);
    drawGridCell(margin + 60, currentY, 60, 10, 'Province:', formData.address_province);
    drawGridCell(margin + 120, currentY, 70, 10, 'Race / Ras:', formData.race);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Physical Address / Woonadres:', `${formData.address_street}, ${formData.address_suburb}, ${formData.address_city}, ${formData.address_postal_code}`);
    currentY += 10;

    doc.rect(margin, currentY, contentWidth, 10);
    doc.text('Deceased Parents / Ouers Oorlede:', margin + 1, currentY + 6);
    drawCheckboxes(margin + 50, currentY + 6, '', [
        { label: 'Mother', value: 'Mother' },
        { label: 'Father', value: 'Father' },
        { label: 'Both', value: 'Both' },
        { label: 'None', value: 'None' }
    ], formData.deceased_parent);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Religion / Geloof:', formData.religion);
    currentY += 10;

    checkPageBreak(30);

    drawSectionHeader('PREVIOUS SCHOOL / VORIGE SKOOL:', currentY);
    currentY += 6;
    drawGridCell(margin, currentY, contentWidth, 10, 'Name of school / Naam van skool:', formData.current_school_name);
    currentY += 10;

    checkPageBreak(50);

    drawSectionHeader('MEDICAL INFORMATION / MEDIESE INLIGTING:', currentY);
    currentY += 6;
    drawGridCell(margin, currentY, 95, 10, 'Medical aid no:', formData.medical_aid_number);
    drawGridCell(margin + 95, currentY, 95, 10, 'Medical aid name:', formData.medical_aid_name);
    currentY += 10;

    drawGridCell(margin, currentY, 95, 8, 'Doctor name:', formData.doctor_name);
    drawGridCell(margin + 95, currentY, 95, 8, 'Doctor tel:', formData.doctor_contact);
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 10, 'Medical condition / Mediese toestand:', formData.medical_condition);
    currentY += 10;

    drawGridCell(margin, currentY, contentWidth, 10, 'Special problems / Spesiale probleem:', formData.special_problems);
    currentY += 10;

    doc.rect(margin, currentY, contentWidth, 10);
    doc.text('Dexterity / Behendigheid:', margin + 1, currentY + 6);
    drawCheckboxes(margin + 60, currentY + 6, '', [
        { label: 'Right', value: 'Right' },
        { label: 'Left', value: 'Left' },
        { label: 'Ambi', value: 'Ambidextrous' }
    ], formData.dexterity);

    drawPageNumber(doc.internal.getNumberOfPages());

    // --- Page 2 ---
    doc.addPage();
    currentY = 20;

    drawSectionHeader('SIBLINGS & FAMILY / GESIN:', currentY);
    currentY += 6;
    doc.rect(margin, currentY, contentWidth, 20);
    doc.setFontSize(7);
    doc.text('Siblings at this school / Broers of susters in hierdie skool:', margin + 1, currentY + 4);
    doc.setFontSize(8);
    doc.text(formData.siblings_info || 'None', margin + 5, currentY + 12);
    currentY += 22;

    drawSectionHeader('PARENT/GUARDIAN 1 / OUER/VOOG 1:', currentY);
    currentY += 6;
    doc.rect(margin, currentY, contentWidth, 8);
    drawCheckboxes(margin + 1, currentY + 5, 'Relationship:', [
        { label: 'Mother', value: 'Mother' },
        { label: 'Father', value: 'Father' },
        { label: 'Guardian', value: 'Guardian' }
    ], formData.parent_primary_relationship);
    currentY += 8;

    drawGridCell(margin, currentY, 30, 8, 'Title:', formData.parent_primary_title);
    drawGridCell(margin + 30, currentY, 60, 8, 'Surname / Van:', formData.parent_primary_surname);
    drawGridCell(margin + 90, currentY, 100, 8, 'First Name:', formData.parent_primary_name);
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 8, 'ID / Passport No:', formData.parent_primary_id);
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Cellphone:', formData.parent_primary_contact);
    drawGridCell(margin + 95, currentY, 95, 8, 'Email:', formData.parent_primary_email);
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Occupation:', formData.parent_primary_occupation);
    drawGridCell(margin + 95, currentY, 95, 8, 'Employer:', formData.parent_primary_employer);
    currentY += 10;

    checkPageBreak(50);

    drawSectionHeader('PARENT/GUARDIAN 2 / OUER/VOOG 2:', currentY);
    currentY += 6;
    drawGridCell(margin, currentY, 30, 8, 'Title:', formData.parent_secondary_title);
    drawGridCell(margin + 30, currentY, 60, 8, 'Surname / Van:', formData.parent_secondary_surname);
    drawGridCell(margin + 90, currentY, 100, 8, 'First Name:', formData.parent_secondary_name);
    currentY += 8;

    drawGridCell(margin, currentY, contentWidth, 8, 'ID No:', formData.parent_secondary_id_number);
    currentY += 8;

    drawGridCell(margin, currentY, 95, 8, 'Cellphone:', formData.parent_secondary_contact);
    drawGridCell(margin + 95, currentY, 95, 8, 'Email:', formData.parent_secondary_email);
    currentY += 12;

    checkPageBreak(80);

    // Declaration
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARATION / VERKLARING:', margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('I hereby declare that the information supplied is accurate and correct.', margin, currentY + 4);
    doc.text('Hiermee verklaar ek dat die inligting verskaf akkuraat en korrek is.', margin, currentY + 7);

    currentY += 15;
    doc.line(margin, currentY, margin + 80, currentY);
    doc.text('Parent/Guardian Signature / Handtekening', margin, currentY + 4);

    if (formData.parent_signature) {
        try {
            const imgEl = new window.Image();
            imgEl.src = formData.parent_signature;
            await new Promise((r) => { imgEl.onload = r; imgEl.onerror = r; });
            const canvas = document.createElement('canvas');
            canvas.width = 400; canvas.height = 150;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 400, 150);
            ctx.drawImage(imgEl, 0, 0, 400, 150);
            const safeJpeg = canvas.toDataURL('image/jpeg', 0.8);
            doc.addImage(safeJpeg, 'JPEG', margin + 5, currentY - 12, 40, 10);
        } catch (e) {}
    }

    doc.line(margin + 100, currentY, margin + 180, currentY);
    doc.text('Date / Datum: ' + new Date().toLocaleDateString(), margin + 100, currentY + 4);

    currentY += 15;

    drawSectionHeader('CHECKLIST / KONTROLELYS:', currentY);
    currentY += 10;
    const checklist = [
        'Birth Certificate / Geboortesertifikaat',
        'Progress report / Vorderingsverslag',
        'Immunisation record / Inentingsertifikaat',
        'Proof of Address / Bewys van Adres',
        'ID Copies of Parents / ID Kopieë'
    ];

    checklist.forEach((item, i) => {
        const itemY = currentY + (i * 7);
        doc.setFontSize(7);
        doc.text(item, margin + 8, itemY);
        doc.rect(margin + 2, itemY - 3, 3, 3, 'S');
    });

    drawPageNumber(doc.internal.getNumberOfPages());

    doc.save(`Alexandria_High_School_Application_${referenceNumber}.pdf`);
};
