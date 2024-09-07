odoo.define('pos_bill_limit.PrintBillButtonOverride', function (require) {
    'use strict';

    const PrintBillButton = require('pos_restaurant.PrintBillButton');
    const rpc = require('web.rpc');
    const Registries = require('point_of_sale.Registries');

    const PrintBillButtonOverride = PrintBillButton => class extends PrintBillButton {
        async trackClicks(order) {
            // Initialize click count if it doesn't exist
            if (!order.clickCount) {
                order.clickCount = 0;
            }

            // Fetch the current cashier using get_cashier()
            const cashier = this.env.pos.get_cashier();
            let billPrintLimit = 1;

            if (cashier) {
                const cashierId = cashier.id;

                // Fetch the employee from hr.employee using the cashier id
                await rpc.query({
                    model: 'hr.employee',
                    method: 'search_read',
                    args: [[['id', '=', cashierId]], ['bill_print_limit']],
                }).then((employees) => {
                    if (employees.length > 0) {
                        const employee = employees[0];
                        billPrintLimit = employee.bill_print_limit || 1;
                    }
                });
            }

            // Increment the count
            order.clickCount += 1;

            // Return the bill print limit and the current click count
            return {
                click_count: order.clickCount,
                bill_print_limit: billPrintLimit,
            };
        }

        async onClick() {
            const order = this.env.pos.get_order();

            // Check if there are any order lines
            if (order.get_orderlines().length > 0) {
                // Track the number of clicks and get bill print limit
                const { click_count, bill_print_limit } = await this.trackClicks(order);

                // Proceed with printing the bill if within the limit
                if (click_count <= bill_print_limit) {
                    order.initialize_validation_date();
                    await this.showTempScreen('BillScreen');
                } else {
                    await this.showPopup('ErrorPopup', {
                        title: this.env._t('Print Limit Reached'),
                        body: this.env._t('You have reached the maximum number of print attempts for this order.'),
                    });
                }
            } else {
                // If no order lines, show an error message
                await this.showPopup('ErrorPopup', {
                    title: this.env._t('Nothing to Print'),
                    body: this.env._t('There are no order lines'),
                });
            }
        }
    };

    Registries.Component.extend(PrintBillButton, PrintBillButtonOverride);

    return PrintBillButtonOverride;
});
