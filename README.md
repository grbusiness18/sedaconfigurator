# SEDA Configurator

Seda Configurator is a subsystem of [SEDA](https://sap-my.sharepoint.com/:p:/r/personal/martin_springer_sap_com/_layouts/15/WopiFrame.aspx?sourcedoc=%7B202D7BA2-2D5E-4558-9C92-67C544AA1120%7D&file=171221_Concept_IntelligentSalesAssistant.pptx&action=default), the Digital Sales Assistant. 

It consists of a Node.js backend and an SAP UI5 frontend, which are hosted in SAP IT CF - see also [SEDA Target Architecture](https://sap-my.sharepoint.com/:p:/r/personal/martin_springer_sap_com/Documents/180319_Architecture_SEDA_CoPilot.pptx?d=w4b40bf4e8afd45fcb17f4405b42a7fc4&csf=1&e=8Ta1iN)

The main objective of SEDA Configurator is to provide a flexible tool for the configuration of intents. As outlined in the Architecture diagram, SEDA takes the text a user enters and forwards it to Recast.AI for Natural Language Processing. Recast.AI returns a classified intent to Seda Configurator, which reads the classification and executes a *configured action*. 

## Configurator UI

Actions can be configured via a Configurator UI, which is the frontend of SEDA configurator. 

As outlined in the [Seda Configurator Mockups](https://sap-my.sharepoint.com/:p:/r/personal/martin_springer_sap_com/Documents/180322_Mockup_SedaConfigurator.pptx?d=w4cda090a63774662a6c9870ffc009bee&csf=1&e=PLw3KF), an *Admin* creates an App via the Configurator UI. A dialogue opens where a user enters app name and description. The following view enables the administrator to classify all intents corresponding to this App. 

The *Object Layout frame* enables an *Admin* to:
* list all the *intents* with name and description corresponding to the App
* add *entities* (e.g. opportunity, deal, account...)
* edit an *intent* (e.g. create an opportunity)
* associate an *action* with an *intent*
* configure a fallback text (i.e. what is being displayed if anything fails)

When SEDA Configurator resolves an intent SEDA (Core) can execute an action. SEDA Configurator configurations are stored in CF.