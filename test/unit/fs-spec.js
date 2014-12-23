/* jshint node:true, expr:true */
'use strict';

var _fs = require('fs');
var _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

var expect = _chai.expect;
var _filesystem = require('../../lib/index').fs;

describe('filesystem', function() {
    beforeEach(function() {
        _fs.mkdirSync('.tmp');
    });
    afterEach(function() {
        try {
            _fs.rmdirSync('.tmp');
        } catch (ex) {
            // Eat the exception
        }
    });

    it('should expose methods required by the interface', function() {
        expect(_filesystem).to.have.property('createFolders').and.to.be.a('function');
        expect(_filesystem).to.have.property('createFiles').and.to.be.a('function');
        expect(_filesystem).to.have.property('cleanupFolders').and.to.be.a('function');
        expect(_filesystem).to.have.property('cleanupFiles').and.to.be.a('function');
    });

    describe('createFolders(): ', function() {
        it('should throw an error if no input arguments are passed', function() {
            var error = 'no folders specified to create';

            expect(function() {
                _filesystem.createFolders();
            }).to.throw(error);
        });

        it('should create a folders when arguments are specified individually', function() {
            var folder1 = '.tmp/foo';
            var folder2 = '.tmp/bar';

            try {
                expect(_fs.existsSync(folder1)).to.be.false;
                expect(_fs.existsSync(folder2)).to.be.false;

                _filesystem.createFolders(folder1, folder2);

                expect(_fs.existsSync(folder1)).to.be.true;
                expect(_fs.existsSync(folder2)).to.be.true;

            } finally {
                //Cleanup
                _fs.rmdirSync(folder1);
                _fs.rmdirSync(folder2);
            }
        });

        it('should create a folders when arguments are specified as an array', function() {
            var folder1 = '.tmp/foo';
            var folder2 = '.tmp/bar';

            try {
                expect(_fs.existsSync(folder1)).to.be.false;
                expect(_fs.existsSync(folder2)).to.be.false;

                _filesystem.createFolders([folder1, folder2]);

                expect(_fs.existsSync(folder1)).to.be.true;
                expect(_fs.existsSync(folder2)).to.be.true;

            } finally {
                //Cleanup
                _fs.rmdirSync(folder1);
                _fs.rmdirSync(folder2);
            }
        });

        it('should not throw an exception if a folder already exists, or the specified path is bad', function() {
            var folder1 = '.tmp/foo';
            var folder2 = '.';

            try {
                _fs.mkdirSync(folder1)

                expect(function() {
                    _filesystem.createFolders(folder1);
                }).not.to.throw();

                expect(function() {
                    _filesystem.createFolders(folder2);
                }).not.to.throw();

            } finally {
                //Cleanup
                _fs.rmdirSync(folder1);
            }
        });
    });

    describe('cleanupFolders(): ', function() {
        it('should throw an error if no input arguments are passed', function() {
            var error = 'no folders specified to clean up';

            expect(function() {
                _filesystem.cleanupFolders();
            }).to.throw(error);
        });

        it('should cleanup folders when arguments are specified individually', function() {
            var folder1 = '.tmp/foo';
            var folder2 = '.tmp/bar';

            try {
                _fs.mkdirSync(folder1);
                _fs.mkdirSync(folder2);

                expect(_fs.existsSync(folder1)).to.be.true;
                expect(_fs.existsSync(folder2)).to.be.true;

                _filesystem.cleanupFolders(folder1, folder2);

                expect(_fs.existsSync(folder1)).to.be.false;
                expect(_fs.existsSync(folder2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.rmdirSync(folder1);
                } catch (ex) {}
                try {
                    _fs.rmdirSync(folder2);
                } catch (ex) {}
            }
        });

        it('should clean up folders when arguments are specified as an array', function() {
            var folder1 = '.tmp/foo';
            var folder2 = '.tmp/bar';

            try {
                _fs.mkdirSync(folder1);
                _fs.mkdirSync(folder2);

                expect(_fs.existsSync(folder1)).to.be.true;
                expect(_fs.existsSync(folder2)).to.be.true;

                _filesystem.cleanupFolders([folder1, folder2]);

                expect(_fs.existsSync(folder1)).to.be.false;
                expect(_fs.existsSync(folder2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.rmdirSync(folder1);
                } catch (ex) {}
                try {
                    _fs.rmdirSync(folder2);
                } catch (ex) {}
            }
        });

        it('should not throw an exception if a folder does not already exist, or the specified path is bad', function() {
            var folder1 = '.tmp/foo';
            var folder2 = '.';

            expect(function() {
                _filesystem.cleanupFolders(folder1);
            }).not.to.throw();

            expect(function() {
                _filesystem.cleanupFolders(folder2);
            }).not.to.throw();
        });
    });

    describe('createFiles(): ', function() {
        it('should throw an error if no input arguments are passed', function() {
            var error = 'no files specified to create';

            expect(function() {
                _filesystem.createFiles();
            }).to.throw(error);
        });

        it('should throw an error if input arguments are not in the correct format', function() {
            var error = 'file path not specified';

            expect(function() {
                _filesystem.createFiles('');
            }).to.throw(error);
            expect(function() {
                _filesystem.createFiles({});
            }).to.throw(error);
        });

        it('should create files when arguments are specified as individual strings', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';

            try {
                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

                _filesystem.createFiles(file1, file2);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should create files when arguments are specified as an array of strings', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';
            var file1Contents = '';
            var file2Contents = '';

            try {
                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

                _filesystem.createFiles([file1, file2]);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;
                expect(_fs.readFileSync(file1).toString()).to.equal(file1Contents);
                expect(_fs.readFileSync(file2).toString()).to.equal(file2Contents);

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should create files when arguments are specified as individual objects', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';
            var file1Contents = 'file #1';
            var file2Contents = 'file #2';
            var file1Obj = {
                path: file1,
                contents: file1Contents
            };
            var file2Obj = {
                path: file2,
                contents: file2Contents
            };

            try {
                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

                _filesystem.createFiles(file1Obj, file2Obj);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;
                expect(_fs.readFileSync(file1).toString()).to.equal(file1Contents);
                expect(_fs.readFileSync(file2).toString()).to.equal(file2Contents);

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should create files when arguments are specified as an array of objects', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';
            var file1Contents = 'file #1';
            var file2Contents = 'file #2';
            var file1Obj = {
                path: file1,
                contents: file1Contents
            };
            var file2Obj = {
                path: file2,
                contents: file2Contents
            };

            try {
                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

                _filesystem.createFiles([file1Obj, file2Obj]);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;
                expect(_fs.readFileSync(file1).toString()).to.equal(file1Contents);
                expect(_fs.readFileSync(file2).toString()).to.equal(file2Contents);

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should create symlinks when a link target is passed', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';
            var linkTarget1 = '..';
            var file2Contents = 'file #2';
            var file1Obj = {
                path: file1,
                linkTo: linkTarget1
            };
            var file2Obj = {
                path: file2,
                contents: file2Contents
            };

            try {
                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

                _filesystem.createFiles([file1Obj, file2Obj]);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;

                var stats = _fs.lstatSync(file1);
                expect(stats.isSymbolicLink()).to.be.true;
                expect(_fs.readFileSync(file2).toString()).to.equal(file2Contents);

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });
    });

    describe('cleanupFiles(): ', function() {
        it('should throw an error if no input arguments are passed', function() {
            var error = 'no files specified to clean up';

            expect(function() {
                _filesystem.cleanupFiles();
            }).to.throw(error);
        });

        it('should cleanup files when arguments are specified as individual strings', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';

            try {
                _fs.writeFileSync(file1, '');
                _fs.writeFileSync(file2, '');

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;

                _filesystem.cleanupFiles(file1, file2);

                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should clean up files when arguments are specified as an array of strings', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';

            try {
                _fs.writeFileSync(file1);
                _fs.writeFileSync(file2);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;

                _filesystem.cleanupFiles([file1, file2]);

                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should cleanup files when arguments are specified as individual objects', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';
            var file1Obj = {
                path: file1
            };
            var file2Obj = {
                path: file2
            };

            try {
                _fs.writeFileSync(file1, '');
                _fs.writeFileSync(file2, '');

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;

                _filesystem.cleanupFiles(file1Obj, file2Obj);

                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should clean up files when arguments are specified as an array of objects', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';
            var file1Obj = {
                path: file1
            };
            var file2Obj = {
                path: file2
            };

            try {
                _fs.writeFileSync(file1, '');
                _fs.writeFileSync(file2, '');

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;

                _filesystem.cleanupFiles([file1Obj, file2Obj]);

                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should clean symlinks and regular files', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.tmp/bar.tmp';

            try {
                _fs.writeFileSync(file1, '');
                _fs.symlinkSync('..', file2);

                expect(_fs.existsSync(file1)).to.be.true;
                expect(_fs.existsSync(file2)).to.be.true;
                var stats = _fs.lstatSync(file2);
                expect(stats.isSymbolicLink()).to.be.true;

                _filesystem.cleanupFiles(file1, file2);

                expect(_fs.existsSync(file1)).to.be.false;
                expect(_fs.existsSync(file2)).to.be.false;

            } finally {
                //Cleanup
                try {
                    _fs.unlinkSync(file1);
                } catch (ex) {}
                try {
                    _fs.unlinkSync(file2);
                } catch (ex) {}
            }
        });

        it('should not throw an exception if a file does not already exist, or the specified path is bad', function() {
            var file1 = '.tmp/foo.tmp';
            var file2 = '.';

            expect(function() {
                _filesystem.cleanupFiles(file1);
            }).not.to.throw();

            expect(function() {
                _filesystem.cleanupFiles(file2);
            }).not.to.throw();
        });
    });

});
