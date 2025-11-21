class EmailService {
    constructor() {
        emailjs.init("hvSRHADQuD_phvsin");
        
        this.newsletterForm = document.getElementById('newsletter-form');
        this.subscribeBtn = document.getElementById('subscribe-btn');
        this.subscribeText = document.getElementById('subscribe-text');
        this.subscribeLoading = document.getElementById('subscribe-loading');
        this.newsletterMessage = document.getElementById('newsletter-message');
        
        this.init();
    }
    
    init() {
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
            console.log('EmailService initialized');
        } else {
            console.error('Form not found! Check element IDs');
        }
    }
    
    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value.trim();
        
        if (!this.isValidEmail(email)) {
            this.showNewsletterMessage('Please enter a valid email address', 'error');
            return;
        }
        
        this.setNewsletterLoading(true);
        
        try {
            await this.sendWelcomeEmail(email);
            this.showNewsletterMessage('🎉 Thank you for subscribing! Welcome to Viktoria Salon! Check your email for a special gift.', 'success');
            this.newsletterForm.reset();
        } catch (error) {
            console.error('Email sending error:', error);
            this.showNewsletterMessage('An error occurred. Please try again later.', 'error');
        } finally {
            this.setNewsletterLoading(false);
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    async sendWelcomeEmail(userEmail) {
        const templateParams = {
            to_email: userEmail,
            email: userEmail,
            name: "Valued Customer",
            from_name: "Viktoria Beauty Salon",
            message: "Welcome to Viktoria Salon! We're excited to have you join our beauty family.",
            discount_code: "WELCOME20",
            salon_name: "Viktoria Beauty Salon",
            reply_to: "dirhdsevy@gmail.com"
        };
        
        try {
            console.log('Sending email to:', userEmail);
            console.log('Template params:', templateParams);
            
            const response = await emailjs.send(
                'service_r4i702y',
                'template_4257r8y', 
                templateParams
            );
            
            console.log('Email successfully sent:', response);
            return response;
            
        } catch (error) {
            console.error('EmailJS error details:', error);
            
            let errorMessage = 'Failed to send email';
            
            if (error.text) {
                console.error('Error text:', error.text);
                errorMessage += ': ' + error.text;
                
                if (error.text.includes('recipients address is empty')) {
                    errorMessage = 'Email configuration issue. Please check that your EmailJS template has the correct "to_email" field.';
                } else if (error.text.includes('Template not found')) {
                    errorMessage = 'Email template not found. Please check template ID.';
                } else if (error.text.includes('Service not found')) {
                    errorMessage = 'Email service not found. Please check service ID.';
                }
            }
            
            if (error.status) {
                console.error('Error status:', error.status);
                
                if (error.status === 422) {
                    errorMessage = 'Template configuration error. Check your EmailJS template setup.';
                } else if (error.status === 400) {
                    errorMessage = 'Bad request. Check your parameters.';
                }
            }
            
            throw new Error(errorMessage);
        }
    }
    
    setNewsletterLoading(isLoading) {
        if (isLoading) {
            this.subscribeText.style.display = 'none';
            this.subscribeLoading.style.display = 'flex';
            this.subscribeBtn.disabled = true;
        } else {
            this.subscribeText.style.display = 'block';
            this.subscribeLoading.style.display = 'none';
            this.subscribeBtn.disabled = false;
        }
    }
    
    showNewsletterMessage(message, type) {
        if (this.newsletterMessage) {
            this.newsletterMessage.textContent = message;
            this.newsletterMessage.className = `form-message ${type}`;
            this.newsletterMessage.style.display = 'block';
            
            if (type === 'success') {
                setTimeout(() => {
                    this.newsletterMessage.style.display = 'none';
                }, 6000);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new EmailService();
});