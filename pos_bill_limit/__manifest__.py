{
    'name': 'Employee Bill Print Limit',
    'version': '1.0',
    'summary': 'Adds a Bill Print Limit for HR Employee',
    'author': 'Fillimon G.',
    'category': 'Point of Sale',
    'depends': ['hr', 'point_of_sale','point_of_sale'],
    'data': [
        
        'security/ir.model.access.csv',
        'views/employee_views.xml',
        'views/assets.xml',
    ],
    
    'assets': {
        'point_of_sale.assets': [
            'your_custom_module/static/src/js/PrintBillButtonOverride.js',
        ],
    },
    
    'images': [
        'static/description/banner.png'
        ],
    'price': 45,
    'currency': 'USD',
    
    'installable': True,
    'application': False,
    'license': 'AGPL-3',
}
