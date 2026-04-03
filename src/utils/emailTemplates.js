// Email Templates for Application Responses
export const EMAIL_TEMPLATES = {
    accepted: {
        subject: 'Outcome of School Application – Alexandria High School',
        body: (app) => `Dear Parent/Guardian,

We are pleased to inform you that the application for admission to Alexandria High School has been successful.

Learner Name: ${app.learner_first_name} ${app.learner_surname}
Grade: ${app.grade_applying_for}
Academic Year: ${app.intake_year}
Reference Number: ${app.reference_number}

Further information regarding registration requirements, dates, and documentation will be communicated in due course.

Kind regards,
School Management Team
Alexandria High School
#DignityFirst`
    },

    rejected: {
        subject: 'Outcome of School Application – Alexandria High School',
        body: (app) => `Dear Parent/Guardian,

Thank you for submitting an application for admission to Alexandria High School.

After careful consideration, we regret to inform you that the application for ${app.learner_first_name} ${app.learner_surname} was not successful.

Due to limited placement availability and the number of applications received, the school is unable to accommodate all applicants.

We appreciate your interest in Alexandria High School and wish the learner every success in their future academic journey.

Kind regards,
School Management Team
Alexandria High School
#DignityFirst`
    },

    waitlisted: {
        subject: 'School Application Status – Alexandria High School',
        body: (app) => `Dear Parent/Guardian,

Thank you for your application to Alexandria High School.

The application for ${app.learner_first_name} ${app.learner_surname} has been placed on the waiting list.

Should a place become available, you will be contacted by the school. Until then, no further action is required.

Kind regards,
School Management Team
Alexandria High School
#DignityFirst`
    },

    incomplete: {
        subject: 'Incomplete School Application – Alexandria High School',
        body: (app) => `Dear Parent/Guardian,

The application submitted for ${app.learner_first_name} ${app.learner_surname} is currently incomplete.

The following required items are outstanding:
• Learner's ID Copy or Birth Certificate
• Latest School Report
• Proof of Residence

Please submit the outstanding information to alexandriahigh6185@gmail.com with reference number \${app.reference_number} as the subject line so that the application can be fully considered.

Kind regards,
School Management Team
Alexandria High School
#DignityFirst`
    }
};

// Generate Gmail compose URL
export const generateGmailLink = (to, subject, body) => {
    const encodedTo = encodeURIComponent(to);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
};

// Generate mailto link (fallback)
export const generateMailtoLink = (to, subject, body) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
};

// Generate call link
export const generateCallLink = (phoneNumber) => {
    // Remove any spaces or special characters
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    return `tel:${cleanNumber}`;
};

// Call script template
export const getCallScript = (learnerName) => {
    return `Good day, this is Alexandria High School calling regarding the application for ${learnerName}.

We are contacting you to discuss the outcome of the application.

An official confirmation will also be sent via email.

Thank you.`;
};

// Copy text to clipboard
export const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            textArea.remove();
            return Promise.resolve();
        } catch (err) {
            textArea.remove();
            return Promise.reject(err);
        }
    }
};
