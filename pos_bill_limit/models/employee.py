from odoo import models, fields

class Employee(models.Model):
    _inherit = 'hr.employee'

    # Field for Bill Print Limit
    bill_print_limit = fields.Integer(string='Bill Print Limit', default=1, help="Set the limit for bill prints for this employee.")
