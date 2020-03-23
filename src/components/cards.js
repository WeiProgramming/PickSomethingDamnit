import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { TinderLikeCard } from 'react-stack-cards';
import CuteFood from '../assets/images/cute-food.png';
import Button from 'react-bootstrap/Button';

const CardsComponent = (props) => {
    let Tinder = null;
    const onTinderSwipe = () => {
        Tinder.swipe();
    }
    return (
        <Container className="card-container">
            {/* <Row>
                {props.cards?.map(card => {
                    return (
                        <Card as={Col} key={card.id} className="custom-card" xs={12} sm={6} md={3}>
                            <Card.Img variant="top" src={card.image_url} className="img-fluid" />
                            <Card.Body>
                                <Card.Title>{card.name}</Card.Title>
                                <Card.Text>
                                    {card.display_phone}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <span>
                                    <small className="text-muted">Rating {card.rating}</small>
                                    <small className="text-muted">Reviews {card.review_count}</small>
                                    <small className="text-muted">Price {card.price}</small>
                                </span>
                            </Card.Footer>
                        </Card>
                    )
                })}
            </Row> */}
            {props.cards ? (<div><TinderLikeCard
                images={[]}
                width={300}
                height={450}
                direction="swipeCornerTopRight"
                duration={300}
                ref={(node) => Tinder = node}
                className="tinder"
            >
                {props.cards.map(card => {
                    return (
                        <Card key={card.id} className="custom-card">
                            <Card.Img variant="top" src={card.image_url} style={{ height: '150px', width: '100%' }} />
                            <Card.Body>
                                <Card.Title>{card.name}</Card.Title>
                                <Card.Text>
                                    {card.display_phone}
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <span>
                                    <small className="text-muted">Rating {card.rating}</small>
                                    <small className="text-muted">Reviews {card.review_count}</small>
                                    <small className="text-muted">Price {card.price}</small>
                                    <small className="text-muted">Distance {((Math.round((card.distance/1609.344) * 10))/10)} mi.</small>
                                </span>
                            </Card.Footer>
                        </Card>
                    )
                })}
            </TinderLikeCard>
            </div>) : <div>Not Loaded</div>}
            <Button variant="primary" size="lg" onClick={onTinderSwipe}>Swipe</Button>
        </Container>
    )
}

export default CardsComponent;