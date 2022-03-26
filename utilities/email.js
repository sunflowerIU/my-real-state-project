const nodemailer = require('nodemailer')
const pug = require('pug')



//Email class
module.exports = class Email {
    constructor(user = '', url = '', from = '', to = '', subject = '', message = '', senderName = '', sendUsing = '') {
        this.user = user
        this.from = from || process.env.EMAIL_FROM
        this.to = to || user.email
        this.subject = subject
        this.senderName = senderName
        this.message = message
        this.hostEmail = process.env.HOST_EMAIL
        this.hostEmailPassword = process.env.EMAIL_PASSWORD
        this.url = url
        this.sendUsing = sendUsing || ''

    }
    //1.  create transporter
    createTransporter() {
        if (process.env.NODE_ENV === 'development') {
            return nodemailer.createTransport({ //use mailtrap as transporter in development
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "fdda7e650b288d",
                    pass: "14d036a3a0d872"
                }
            });
        } else { //use gmail as transporter in production
            if (this.sendUsing === 'gmail') {
                return nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.HOST_EMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    }
                })
            }
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                }
            })
    
        }
    }

    //2. send email
    async sendEmail(subject, template) {

        // send mail with defined transport object
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            name: this.user.name,
            url: this.url || '',
            subject,
            senderName: this.senderName || '',
            contactedFrom: this.from || '',
            message: this.message || ''
        })
        let options = {
            from: this.from, // sender address
            to: this.to, // list of receivers
            subject, // Subject line
            // text:message,
            html, // html body
        }

        await this.createTransporter().sendMail(options)

    }

    //3. send welcome email
    async welcomeEmail() {
        let subject = `Welcome ${this.user.name}`
        await this.sendEmail(subject, 'welcome')
    }


    //4. send pasword reset email
    async sendPasswordResetEmail() {
        let subject = 'Password reset'
        await this.sendEmail(subject, 'passwordReset')
    }


    //5. send contact email
    async contactEmail() {
        const subject = this.subject
        await this.sendEmail(subject, 'contact')

    }

}