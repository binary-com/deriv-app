import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';

describe('<TradeCategoriesGIF />', () => {
    afterEach(() => {
        jest.resetModules();
    });
    it('expect ImageAsianUpDown to be rendered when trade category is TRADE_TYPES.ASIAN', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-asian.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageAsian'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default category={TRADE_TYPES.ASIAN} selected_contract_type={TRADE_TYPES.ASIAN} />
                    );
                    expect(screen.getByText(/imageasian/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageSpread to be rendered when trade category is TRADE_TYPES.CALL_PUT_SPREAD', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-spread.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageSpread'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.CALL_PUT_SPREAD}
                            selected_contract_type={TRADE_TYPES.CALL_PUT_SPREAD}
                        />
                    );
                    expect(screen.getByText('ImageSpread')).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageEndsInOut to be rendered when trade category is TRADE_TYPES.END', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-ends-in-out.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageEndsInOut'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category={TRADE_TYPES.END} selected_contract_type={TRADE_TYPES.END} />);
                    expect(screen.getByText(/imageendsinout/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect Even/Odd video to be rendered when trade category is TRADE_TYPES.EVEN_ODD', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'Even/Odd video'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.EVEN_ODD}
                            selected_contract_type={TRADE_TYPES.EVEN_ODD}
                        />
                    );
                    expect(screen.getByText(/even\/odd video/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoHighLow to be rendered when trade category is TRADE_TYPES.HIGH_LOW', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoHighLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.HIGH_LOW}
                            selected_contract_type={TRADE_TYPES.HIGH_LOW}
                        />
                    );
                    expect(screen.getByText(/videohighlow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageCloseToLow to be rendered when trade category is TRADE_TYPES.LB_CALL', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-close-to-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageCloseToLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.LB_CALL}
                            selected_contract_type={TRADE_TYPES.LB_CALL}
                        />
                    );
                    expect(screen.getByText(/imageclosetolow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageHighToClose to be rendered when trade category is TRADE_TYPES.LB_PUT', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-to-close.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighToClose'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default category={TRADE_TYPES.LB_PUT} selected_contract_type={TRADE_TYPES.LB_PUT} />
                    );
                    expect(screen.getByText(/imagehightoclose/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageHighToLow to be rendered when trade category is TRADE_TYPES.LB_HIGH_LOW', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-to-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighToLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.LB_HIGH_LOW}
                            selected_contract_type={TRADE_TYPES.LB_HIGH_LOW}
                        />
                    );
                    expect(screen.getByText(/imagehightolow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoRiseFall to be rendered when trade category is TRADE_TYPES.RISE_FALL', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoRiseFall'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.RISE_FALL}
                            selected_contract_type={TRADE_TYPES.RISE_FALL}
                        />
                    );
                    expect(screen.getByText(/videorisefall/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoRiseFall to be rendered when trade category is TRADE_TYPES.RISE_FALL_EQUAL', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoRiseFall'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.RISE_FALL_EQUAL}
                            selected_contract_type={TRADE_TYPES.RISE_FALL_EQUAL}
                        />
                    );
                    expect(screen.getByText(/videorisefall/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect Matches/Differs video to be rendered when trade category is TRADE_TYPES.MATCH_DIFF', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'Matches/Differs video'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.MATCH_DIFF}
                            selected_contract_type={TRADE_TYPES.MATCH_DIFF}
                        />
                    );
                    expect(screen.getByText(/matches\/differs video/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoMultiplier to be rendered when trade category is TRADE_TYPES.MULTIPLIER', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoMultiplier'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.MULTIPLIER}
                            selected_contract_type={TRADE_TYPES.MULTIPLIER}
                        />
                    );
                    expect(screen.getByText(/videomultiplier/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect OverUnder video to be rendered when trade category is TRADE_TYPES.OVER_UNDER', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'Over/Under video'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.OVER_UNDER}
                            selected_contract_type={TRADE_TYPES.OVER_UNDER}
                        />
                    );
                    expect(screen.getByText(/over\/under video/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageReset to be rendered when trade category is TRADE_TYPES.RESET', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-reset.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageReset'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default category={TRADE_TYPES.RESET} selected_contract_type={TRADE_TYPES.RESET} />
                    );
                    expect(screen.getByText(/imagereset/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageRunHighLow to be rendered when trade category is TRADE_TYPES.RUN_HIGH_LOW', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-run-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRunHighLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.RUN_HIGH_LOW}
                            selected_contract_type={TRADE_TYPES.RUN_HIGH_LOW}
                        />
                    );
                    expect(screen.getByText(/imagerunhighlow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoAccumulator to be rendered when trade category is accumulator', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoAccumulator'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.ACCUMULATOR}
                            selected_contract_type={TRADE_TYPES.ACCUMULATOR}
                        />
                    );
                    expect(screen.getByText(/videoaccumulator/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageTickHighLow to be rendered when trade category is TRADE_TYPES.TICK_HIGH_LOW', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-tick-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageTickHighLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.TICK_HIGH_LOW}
                            selected_contract_type={TRADE_TYPES.TICK_HIGH_LOW}
                        />
                    );
                    expect(screen.getByText(/imagetickhighlow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoTouch to be rendered when trade category is TRADE_TYPES.TOUCH', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoTouch'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default category={TRADE_TYPES.TOUCH} selected_contract_type={TRADE_TYPES.TOUCH} />
                    );
                    expect(screen.getByText(/videotouch/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect VideoVanilla to be rendered when trade category is vanilla', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoVanilla'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.VANILLA.CALL}
                            selected_contract_type={TRADE_TYPES.VANILLA.CALL}
                        />
                    );
                    expect(screen.getByText(/videovanilla/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageTurbos to be rendered when trade category is TRADE_TYPES.TURBOS.LONG', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-turbos.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageTurbos'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(
                        <moduleName.default
                            category={TRADE_TYPES.TURBOS.LONG}
                            selected_contract_type={TRADE_TYPES.TURBOS.LONG}
                        />
                    );
                    expect(screen.getByText(/imageturbos/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('component should return null if category is not equal to selected_contract_type', async () => {
        import('../trade-categories-gif')
            .then(moduleName => {
                const { container } = render(
                    <moduleName.default category='wrong_trade_category' selected_contract_type='wrong_contract_type' />
                );
                expect(container).toBeEmptyDOMElement();
            })
            .catch(error => {
                throw new Error(error);
            });
    });
    it('component should return null if category and selected_contract_type are not defined correctly', async () => {
        import('../trade-categories-gif')
            .then(moduleName => {
                const { container } = render(
                    <moduleName.default category='wrong_test' selected_contract_type='wrong_test' />
                );
                expect(container).toBeEmptyDOMElement();
            })
            .catch(error => {
                throw new Error(error);
            });
    });
});
