import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.sales_forecasts import Sales_forecasts

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Sales_forecastsService:
    """Service layer for Sales_forecasts operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Sales_forecasts]:
        """Create a new sales_forecasts"""
        try:
            obj = Sales_forecasts(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created sales_forecasts with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating sales_forecasts: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Sales_forecasts]:
        """Get sales_forecasts by ID"""
        try:
            query = select(Sales_forecasts).where(Sales_forecasts.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching sales_forecasts {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of sales_forecastss"""
        try:
            query = select(Sales_forecasts)
            count_query = select(func.count(Sales_forecasts.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Sales_forecasts, field):
                        query = query.where(getattr(Sales_forecasts, field) == value)
                        count_query = count_query.where(getattr(Sales_forecasts, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Sales_forecasts, field_name):
                        query = query.order_by(getattr(Sales_forecasts, field_name).desc())
                else:
                    if hasattr(Sales_forecasts, sort):
                        query = query.order_by(getattr(Sales_forecasts, sort))
            else:
                query = query.order_by(Sales_forecasts.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching sales_forecasts list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Sales_forecasts]:
        """Update sales_forecasts"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Sales_forecasts {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated sales_forecasts {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating sales_forecasts {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete sales_forecasts"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Sales_forecasts {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted sales_forecasts {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting sales_forecasts {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Sales_forecasts]:
        """Get sales_forecasts by any field"""
        try:
            if not hasattr(Sales_forecasts, field_name):
                raise ValueError(f"Field {field_name} does not exist on Sales_forecasts")
            result = await self.db.execute(
                select(Sales_forecasts).where(getattr(Sales_forecasts, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching sales_forecasts by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Sales_forecasts]:
        """Get list of sales_forecastss filtered by field"""
        try:
            if not hasattr(Sales_forecasts, field_name):
                raise ValueError(f"Field {field_name} does not exist on Sales_forecasts")
            result = await self.db.execute(
                select(Sales_forecasts)
                .where(getattr(Sales_forecasts, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Sales_forecasts.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching sales_forecastss by {field_name}: {str(e)}")
            raise