import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.profit_predictions import Profit_predictions

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Profit_predictionsService:
    """Service layer for Profit_predictions operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Profit_predictions]:
        """Create a new profit_predictions"""
        try:
            obj = Profit_predictions(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created profit_predictions with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating profit_predictions: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Profit_predictions]:
        """Get profit_predictions by ID"""
        try:
            query = select(Profit_predictions).where(Profit_predictions.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching profit_predictions {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of profit_predictionss"""
        try:
            query = select(Profit_predictions)
            count_query = select(func.count(Profit_predictions.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Profit_predictions, field):
                        query = query.where(getattr(Profit_predictions, field) == value)
                        count_query = count_query.where(getattr(Profit_predictions, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Profit_predictions, field_name):
                        query = query.order_by(getattr(Profit_predictions, field_name).desc())
                else:
                    if hasattr(Profit_predictions, sort):
                        query = query.order_by(getattr(Profit_predictions, sort))
            else:
                query = query.order_by(Profit_predictions.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching profit_predictions list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Profit_predictions]:
        """Update profit_predictions"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Profit_predictions {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated profit_predictions {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating profit_predictions {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete profit_predictions"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Profit_predictions {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted profit_predictions {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting profit_predictions {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Profit_predictions]:
        """Get profit_predictions by any field"""
        try:
            if not hasattr(Profit_predictions, field_name):
                raise ValueError(f"Field {field_name} does not exist on Profit_predictions")
            result = await self.db.execute(
                select(Profit_predictions).where(getattr(Profit_predictions, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching profit_predictions by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Profit_predictions]:
        """Get list of profit_predictionss filtered by field"""
        try:
            if not hasattr(Profit_predictions, field_name):
                raise ValueError(f"Field {field_name} does not exist on Profit_predictions")
            result = await self.db.execute(
                select(Profit_predictions)
                .where(getattr(Profit_predictions, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Profit_predictions.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching profit_predictionss by {field_name}: {str(e)}")
            raise