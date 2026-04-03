import { jsPDF } from 'jspdf';

// PDF Generation Function
const generatePDF = (app) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // School Letterhead
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ALEXANDRIA HIGH SCHOOL', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Excellence in Education', pageWidth / 2, 22, { align: 'center' });
    doc.text('alexandriahigh6185@gmail.com | 063 652 0546', pageWidth / 2, 28, { align: 'center' });

    // Orange accent line
    doc.setFillColor(249, 115, 22); // primary orange
    doc.rect(0, 40, pageWidth, 3, 'F');

    // Document Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION SUMMARY', 20, 55);

    // Reference Number
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Reference: ${app.reference_number}`, 20, 62);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA')}`, pageWidth - 20, 62, { align: 'right' });

    let yPos = 75;

    // Applicant Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('APPLICANT INFORMATION', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const applicantInfo = [
        ['Full Name:', `${app.learner_first_name} ${app.learner_surname}`],
        ['ID Number:', app.id_number],
        ['Date of Birth:', app.date_of_birth],
        ['Gender:', app.gender],
        ['Grade Applying For:', `${app.grade_applying_for} (${app.intake_year})`],
        ['Home Language:', app.home_language],
        ['Race:', app.race]
    ];

    applicantInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value || 'N/A', 70, yPos);
        yPos += 6;
    });

    yPos += 5;

    // Guardian Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('GUARDIAN CONTACT INFORMATION', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const guardianInfo = [
        ['Primary Guardian:', app.parent_primary_name],
        ['Relationship:', app.parent_primary_relationship],
        ['ID Number:', app.parent_primary_id],
        ['Contact Number:', app.parent_primary_contact],
        ['Email Address:', app.parent_primary_email]
    ];

    guardianInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value || 'N/A', 70, yPos);
        yPos += 6;
    });

    yPos += 5;

    // Residential Address
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESIDENTIAL ADDRESS', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${app.address_street}`, 20, yPos);
    yPos += 6;
    doc.text(`${app.address_suburb}, ${app.address_city}`, 20, yPos);
    yPos += 6;
    doc.text(`${app.address_postal_code}, ${app.address_province}`, 20, yPos);
    yPos += 10;

    // Current School
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CURRENT SCHOOL INFORMATION', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const schoolInfo = [
        ['School Name:', app.current_school_name],
        ['Current Grade:', app.current_grade],
        ['Province:', app.province_of_current_school]
    ];

    schoolInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value || 'N/A', 70, yPos);
        yPos += 6;
    });

    if (app.reason_for_transfer) {
        yPos += 2;
        doc.setFont('helvetica', 'bold');
        doc.text('Reason for Transfer:', 20, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(app.reason_for_transfer, pageWidth - 40);
        doc.text(splitText, 20, yPos);
        yPos += splitText.length * 6;
    }

    // Footer
    doc.setFillColor(240, 240, 240);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated document. No signature required.', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Save PDF
    doc.save(`Application_${app.reference_number}.pdf`);
};

export { generatePDF };
