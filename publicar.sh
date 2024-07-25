#!/bin/bash

if [ -z "$1" ]; then
    echo "Informe a mensagem do commit";
    echo "Informe a mensagem do commit";
    echo "Informe a mensagem do commit";
    exit 1;
fi

echo "Adicionando arquivos ao git";
git add . 

echo "Commitando arquivos com sua mensagem";
git commit -m "$1"

echo "Enviando arquivos para o github";
git pull 

