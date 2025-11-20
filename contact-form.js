class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.submitText = document.getElementById('submit-text');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.formMessage = document.getElementById('form-message');
        
        this.botToken = '---';
        this.chatId = '---';
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }
    
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    clearFieldError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.parentElement.classList.remove('error');
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(field.id) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Ім\'я обов\'язкове для заповнення';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Ім\'я повинно містити мінімум 2 символи';
                }
                break;
                
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email обов\'язковий для заповнення';
                } else if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Введіть коректний email';
                }
                break;
                
            case 'phone':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Телефон обов\'язковий для заповнення';
                } else if (!this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Введіть коректний номер телефону';
                }
                break;
                
            case 'service':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Послуга обов\'язкова для заповнення';
                }
                break;
        }
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        if (!isValid) {
            field.parentElement.classList.add('error');
        } else {
            field.parentElement.classList.remove('error');
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    validateForm() {
        const fields = ['name', 'email', 'phone', 'service'];
        let isValid = true;
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showMessage('Будь ласка, виправте помилки у формі', 'error');
            return;
        }
        
        this.setLoading(true);
        
        try {
            const formData = this.getFormData();
            await this.sendToTelegram(formData);
            this.showMessage('Дякуємо! Ваше повідомлення відправлено. Ми зв\'яжемося з вами найближчим часом.', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Помилка відправки:', error);
            this.showMessage('Сталася помилка при відправці форми. Спробуйте ще раз пізніше.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value.trim(),
            note: document.getElementById('note').value.trim()
        };
    }
    
    async sendToTelegram(formData) {
        const message = this.formatMessage(formData);
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    formatMessage(data) {
        return `
<b>🔄 Нова заявка з форми зворотного зв'язку</b>

<b>👤 Ім'я:</b> ${data.name}
<b>📧 Email:</b> ${data.email}
<b>📞 Телефон:</b> ${data.phone}
<b>💇 Послуга:</b> ${data.service}
<b>📝 Нотатка:</b> ${data.note || 'Не вказано'}

<b>⏰ Час:</b> ${new Date().toLocaleString('uk-UA')}
        `.trim();
    }
    
    setLoading(isLoading) {
        if (isLoading) {
            this.submitText.style.display = 'none';
            this.loadingSpinner.style.display = 'flex';
            this.submitBtn.disabled = true;
        } else {
            this.submitText.style.display = 'block';
            this.loadingSpinner.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }
    
    showMessage(message, type) {
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;
        this.formMessage.style.display = 'block';
        
        setTimeout(() => {
            this.formMessage.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new ContactForm();
});