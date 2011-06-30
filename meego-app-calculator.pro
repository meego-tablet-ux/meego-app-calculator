VERSION = 0.2.7
TARGET = meego-app-calculator
TEMPLATE = subdirs

qmlfiles.files += *.qml *.js images/ 
qmlfiles.path += $$INSTALL_ROOT/usr/share/$$TARGET

INSTALLS += qmlfiles

TRANSLATIONS += *.qml *.js 
PROJECT_NAME = meego-app-calculator

OTHER_FILES += *.qml *.js

dist.commands += rm -fR $${PROJECT_NAME}-$${VERSION} &&
dist.commands += git clone . $${PROJECT_NAME}-$${VERSION} &&
dist.commands += rm -fR $${PROJECT_NAME}-$${VERSION}/.git &&
dist.commands += rm -f $${PROJECT_NAME}-$${VERSION}/.gitignore &&
dist.commands += mkdir -p $${PROJECT_NAME}-$${VERSION}/ts &&
dist.commands += lupdate $${TRANSLATIONS} -ts $${PROJECT_NAME}-$${VERSION}/ts/$${PROJECT_NAME}.ts &&
dist.commands += tar jcpvf $${PROJECT_NAME}-$${VERSION}.tar.bz2 $${PROJECT_NAME}-$${VERSION} &&
dist.commands += rm -fR $${PROJECT_NAME}-$${VERSION} &&
dist.commands += echo; echo Created $${PROJECT_NAME}-$${VERSION}.tar.bz2
QMAKE_EXTRA_TARGETS += dist
