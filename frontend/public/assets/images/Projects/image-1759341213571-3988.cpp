#include "Menus.h"

Menus::Menus(){

}
Menus::~Menus(){
    std::vector<Pizza*>::iterator it;

    for(it = pizzas.begin(); it != pizzas.end(); ++it){
        delete *it;
    }
    observers.clear();
}


void Menus::addObserver(Observer* observer){
    observers.push_back(observer);
}

void Menus::removeObserver(Observer* observer){
    std::vector<Observer*>::iterator it;
    bool found = false;
    it = observers.begin();
    while((it != observers.end() && (!found))){
        if(*it == observer){
            found = true;
            observers.erase(it);
        }
        ++it;
    }
}

void Menus::addPizza(Pizza* pizza){
    pizzas.push_back(pizza);
    notifyObservers("New pizza added: " + pizza->getName());
}

void Menus::removePizza(Pizza* pizza){
    std::vector<Pizza*>::iterator it;
    bool found = false;
    it = pizzas.begin();
    while((it != pizzas.end() && (!found))){
        if(*it == pizza){
            found = true;
            pizzas.erase(it);
        }
        ++it;
    }
    notifyObservers("Pizza removed: " + pizza->getName());
}