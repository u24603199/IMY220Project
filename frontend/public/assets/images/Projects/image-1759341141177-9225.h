#ifndef BULKDISCOUNT_H
#define BULKDISCOUNT_H

#include "Discount.h"

class BulkDiscount : public Discount {
    public:
        BulkDiscount();
        ~BulkDiscount();
        double applyDiscount();
};

#endif