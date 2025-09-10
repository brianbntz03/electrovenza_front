# Variables with default values
PAGE_FILE ?= src/framework/Page.js
LIST_FILE ?= src/framework/List.js
MODAL_FILE ?= src/framework/Modal.js
CREAR_FILE ?= src/framework/Crear.js

DEST_PAGE_FILE ?= src/pages
DEST_LIST_FILE ?= src/Components/Lists/
DEST_MODAL_FILE ?= src/Components/modals/
DEST_CREAR_FILE ?= src/Components/Crear/

OLD_TEXT ?= TEMPLATE_LISTADO_NAME
NEW_TEXT ?= replacement

# Copy and replace content
generate:

# Copiando la pagina
	@echo "Copying $(PAGE_FILE) to $(DEST_PAGE_FILE)/$(NEW_TEXT).js"
	cp $(PAGE_FILE) $(DEST_PAGE_FILE)/Page$(NEW_TEXT).js
	@echo "Replacing '$(OLD_TEXT)' with '$(NEW_TEXT)'"
	sed -i 's/$(OLD_TEXT)/$(NEW_TEXT)/g' $(DEST_PAGE_FILE)/Page$(NEW_TEXT).js
	@echo "  Listo...  \n"

# Copiando el listado
	@echo "Copying $(LIST_FILE) to $(DEST_LIST_FILE)/Listado$(NEW_TEXT).js"
	cp $(LIST_FILE) $(DEST_LIST_FILE)/Listado$(NEW_TEXT).js
	@echo "Replacing '$(OLD_TEXT)' with '$(NEW_TEXT)'"
	sed -i 's/$(OLD_TEXT)/$(NEW_TEXT)/g' $(DEST_LIST_FILE)/Listado$(NEW_TEXT).js
	@echo "  Listo...  \n"


# Copiando el modal
	@echo "Copying $(MODAL_FILE) to $(DEST_MODAL_FILE)/Modal$(NEW_TEXT).js"
	cp $(MODAL_FILE) $(DEST_MODAL_FILE)/ModalEditar$(NEW_TEXT).js
	@echo "Replacing '$(OLD_TEXT)' with '$(NEW_TEXT)'"
	sed -i 's/$(OLD_TEXT)/$(NEW_TEXT)/g' $(DEST_MODAL_FILE)/ModalEditar$(NEW_TEXT).js
	@echo "  Listo...  \n\n"

# Copiando Crear
	@echo "Copying $(CREAR_FILE) to $(DEST_CREAR_FILE)/Crear$(NEW_TEXT).js"
	cp $(CREAR_FILE) $(DEST_CREAR_FILE)/Crear$(NEW_TEXT).js
	@echo "Replacing '$(OLD_TEXT)' with '$(NEW_TEXT)'"
	sed -i 's/$(OLD_TEXT)/$(NEW_TEXT)/g' $(DEST_CREAR_FILE)/Crear$(NEW_TEXT).js
	@echo "  Listo...  \n\n"

	@echo "  Todo Listo...  \n\n"

# Function-style targets
generate-%:
	@$(MAKE) generate NEW_TEXT=$*

# Clean generated files
clean:
	rm -f $(DEST_FILE)

.PHONY: generate clean