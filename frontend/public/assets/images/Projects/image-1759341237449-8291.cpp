#include "Waiting.h"

Waiting::Waiting(){

}

Waiting::~Waiting(){

}

void Waiting::add(Pizza* pizza, std::vector<Pizza*>& pizzas){
    std::cout << "Pizza is currently in a review state, call reverse() to be able to add pizzas again" << std::endl;
    delete pizza;
}