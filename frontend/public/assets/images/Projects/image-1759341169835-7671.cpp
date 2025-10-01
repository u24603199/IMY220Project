#include "Ordering.h"

Ordering::Ordering(){

}

Ordering::~Ordering(){

}

void Ordering::add(Pizza* pizza, std::vector<Pizza*>& pizzas){
    pizzas.push_back(pizza);
}